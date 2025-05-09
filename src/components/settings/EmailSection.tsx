import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEmailSettings } from '@/hooks/useEmailSettings';
import { CheckCircle } from 'lucide-react';

const EmailSection = () => {
  const { email, setEmail, isSaving, isSuccess, error, saveEmail } =
    useEmailSettings();

  return (
    <div className='mb-12'>
      <h2 className='text-lg font-semibold mb-4'>E-Mail</h2>
      <p className='text-mb-silver text-sm font-medium mb-6'>
        This email address will be used to send important notifications about
        your account and to assist with account recovery.
      </p>

      <div className='mb-6'>
        <label className='block text-[#ADAFB6] text-sm font-medium mb-2'>
          E-Mail Address
        </label>
        <div className='relative'>
          <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email address'
            className='w-full max-w-md bg-[#282A2F] border-none text-[#6B6E74] text-base font-normal'
          />
          {isSuccess && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500'>
              <CheckCircle size={18} />
            </div>
          )}
        </div>
        {error && <p className='mt-2 text-red-500 text-sm'>{error}</p>}
      </div>

      <Button
        onClick={saveEmail}
        disabled={!email || isSaving}
        variant='secondary'
      >
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};

export default EmailSection;
