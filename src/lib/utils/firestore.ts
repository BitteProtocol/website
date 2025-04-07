import {
  DocumentData,
  Firestore,
  WithFieldValue,
} from '@google-cloud/firestore';
import { COLLECTIONS, BittePrimitiveNames } from '../constants';
import { Tool } from '../types/tool.types';

export type FirestoreOperationResult = {
  success: boolean;
  error?: unknown;
};

const firestoreCredentials = process.env.GCP_SERVICE_ACCOUNT_KEY;
if (!firestoreCredentials) {
  console.warn('Missing GCP_SERVICE_ACCOUNT_KEY in env: using {}');
}

const db = new Firestore({
  projectId: process.env.GCP_PROJECT,
  credentials: JSON.parse(firestoreCredentials || '{}'),
  databaseId: 'mainnet',
});

export const read = async <T>(
  collection: string,
  ref: string
): Promise<T | null> => {
  const doc = await db.collection(collection).doc(ref).get();
  if (!doc.exists) {
    return null;
  }
  return doc.data() as T;
};

export const readAll = async <T>(collection: string): Promise<T[]> =>
  (await db.collection(collection).get()).docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as T[];

export const write = async <T extends WithFieldValue<DocumentData>>(
  collection: string,
  ref: string,
  data: T
): Promise<FirestoreOperationResult> => {
  try {
    await db.collection(collection).doc(ref).set(data);
    return { success: true };
  } catch (error) {
    console.error(`Error writing to ${collection}/${ref}`, error);
    return { success: false, error };
  }
};

export const writeBatch = async (
  writes: {
    collection: string;
    ref: string;
    data: WithFieldValue<DocumentData>;
  }[]
): Promise<FirestoreOperationResult> => {
  try {
    const batch = db.batch();
    for (const write of writes) {
      batch.set(db.collection(write.collection).doc(write.ref), write.data);
    }
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error(`Error writing batch`, error);
    return { success: false, error };
  }
};

export const update = async (
  collection: string,
  ref: string,
  data: WithFieldValue<DocumentData>
): Promise<FirestoreOperationResult> => {
  try {
    await db.collection(collection).doc(ref).update(data);
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${collection}/${ref}`, error);
    return { success: false, error };
  }
};

export const destroy = async (
  collection: string,
  ref: string
): Promise<FirestoreOperationResult> => {
  try {
    await db.collection(collection).doc(ref).delete();
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${collection}/${ref}`, error);
    return { success: false, error };
  }
};

export const destroyBatch = async (
  destroys: { collection: string; ref: string }[]
): Promise<FirestoreOperationResult> => {
  try {
    const batch = db.batch();
    for (const destroy of destroys) {
      batch.delete(db.collection(destroy.collection).doc(destroy.ref));
    }
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error(`Error deleting batch`, error);
    return { success: false, error };
  }
};

export const isDocumentNotFoundError = (err: Error): boolean =>
  err.message.startsWith('Doc at ref ') && err.message.endsWith(' not found');

export const catchDocumentNotFound = (err: Error): null => {
  if (isDocumentNotFoundError(err)) return null;
  throw err;
};

export const queryAgents = async <T>(
  options: {
    verified?: boolean;
    withTools?: boolean;
    chainIds?: string[];
    offset?: number;
    limit?: number;
    category?: string | null;
  } = {}
): Promise<T[]> => {
  let query: FirebaseFirestore.Query = db.collection(COLLECTIONS.AGENTS);

  if (options.verified) {
    query = query.where('verified', '==', true);
  }

  if (options.chainIds?.length) {
    query = query.where(
      'chainIds',
      'array-contains-any',
      options.chainIds.map((id) => parseInt(id))
    );
  }

  if (options.category) {
    query = query.where('category', '==', options.category);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.offset(options.offset);
  }

  const snapshot = await query.get();
  const agents = snapshot.docs.map((doc) => doc.data());

  if (!options.withTools) {
    return agents.map((agent) => {
      const { ...rest } = agent;
      return rest as T;
    });
  }

  return agents as T[];
};

export const queryTools = async <T>(
  options: {
    verified?: boolean;
    functionName?: string;
    offset?: number;
    chainId?: string;
  } = {}
): Promise<T[]> => {
  let query: FirebaseFirestore.Query = db
    .collection(COLLECTIONS.AGENTS)
    .select('tools', 'image', 'chainIds');

  if (options.verified) {
    query = query.where('verified', '==', true);
  }

  if (options.chainId) {
    query = query.where('chainIds', 'array-contains', options.chainId);
  }

  const limit = 100;
  query = query.limit(limit);

  const snapshot = await query.get();
  const tools: Tool[] = [];

  for (const doc of snapshot.docs) {
    const agent = doc.data();
    if (!agent.tools?.length) continue;

    const baseToolData = {
      image: agent.image,
      chainIds: agent.chainIds || [],
    };

    for (const tool of agent.tools) {
      if (
        options.functionName &&
        !tool.function.name
          .toLowerCase()
          .includes(options.functionName.toLowerCase())
      ) {
        continue;
      }

      tools.push({
        ...tool,
        ...baseToolData,
      });
    }
  }

  const uniqueTools = Array.from(
    new Map(
      tools
        .filter((tool) => BittePrimitiveNames.includes(tool.function.name))
        .map((tool) => [tool.function.name, tool])
    ).values()
  ).concat(
    Array.from(
      new Map(
        tools
          .filter((tool) => !BittePrimitiveNames.includes(tool.function.name))
          .map((tool) => [
            `${tool.execution.baseUrl}${tool.execution.path}`,
            tool,
          ])
      ).values()
    )
  );

  if (options.offset) {
    return uniqueTools.slice(options.offset) as T[];
  }

  return uniqueTools as T[];
};
