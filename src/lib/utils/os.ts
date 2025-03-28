export function getOS() {
  if (typeof window === 'undefined') return null;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i;
  const windowsPlatforms = /(win32|win64|windows|wince)/i;
  const iosPlatforms = /(iphone|ipad|ipod)/i;
  let os = null;

  if (macosPlatforms.test(userAgent)) {
    os = 'macos';
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios';
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows';
  } else if (/android/.test(userAgent)) {
    os = 'android';
  } else if (!os && /linux/.test(userAgent)) {
    os = 'linux';
  }

  return os;
}

export const isMac = () => {
  return getOS() === 'macos';
};

export const isWindows = () => {
  return getOS() === 'windows';
};

export const isDesktopLinux = () => {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  return getOS() === 'linux' && !userAgent.includes('android');
};

export const getCommandKey = () => {
  if (isMac()) {
    return '⌘';
  }
  return 'Ctrl';
};
