import { useWindowSize } from '@/lib/utils/useWindowSize';
import { shortenAddress, shortenString } from '@/lib/utils/strings';
import { CopyIcon } from 'lucide-react';
import { useState } from 'react';

export const CopyStandard = ({
  text,
  textColor,
  textSize,
  charSize,
  isUrl,
  nopadding,
  noformatting,
  isNearAddress,
  isNearAddressSec,
  copySize,
  onIconClick,
}: {
  text: string;
  textColor?: string;
  textSize?: string;
  charSize?: number;
  isUrl?: boolean;
  nopadding?: boolean;
  noformatting?: boolean;
  isNearAddress?: boolean;
  isNearAddressSec?: boolean;
  copySize?: number;
  onIconClick?: boolean;
}) => {
  const [showLinkCopiedText, setShowLinkCopiedText] = useState(false);

  const { width } = useWindowSize();
  const isMobile = !!width && width < 640;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(text);

    setShowLinkCopiedText(true);
    setTimeout(() => setShowLinkCopiedText(false), 3000);
  };

  const cssClass = nopadding ? `cursor-pointer` : `cursor-pointer p-2.5`;

  const renderNearAddress = (
    text: string,
    showCopied: boolean,
    textColor: string
  ) => {
    if (showCopied) {
      return (
        <span className={`whitespace-nowrap font-medium ${textColor}`}>
          Copied
        </span>
      );
    }

    const [main, ...rest] = text.split('.');

    if (isMobile) {
      return (
        <span className={`whitespace-nowrap font-medium ${textColor}`}>
          {shortenAddress(text)}
        </span>
      );
    }

    return (
      <>
        <span className={`whitespace-nowrap font-medium ${textColor}`}>
          {shortenString(main, 12)}
        </span>
        <span className='text-text-secondary'>.{rest.join('.')}</span>
      </>
    );
  };

  const renderEthAddress = () => {
    if (showLinkCopiedText) return 'Copied';
    if (noformatting) return text;
    /* const size = isMobile ? charSize ?? 18 : charSize ?? 35; */
    return shortenAddress(text);
  };

  const copyIconProps = onIconClick
    ? {
        onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
          e.stopPropagation();
          handleCopyLink();
        },
      }
    : {};

  const divProps = onIconClick ? {} : { onClick: handleCopyLink };

  return (
    <div id='copy' className={cssClass} {...divProps}>
      <span
        className={`relative flex items-center justify-center gap-2 ${
          textColor ? `text-${textColor}` : 'text-shad-blue-100'
        } ${textSize ? `text-${textSize}` : 'text-base'}`}
      >
        {(isNearAddress || isNearAddressSec) && (
          <div>
            {renderNearAddress(
              text,
              showLinkCopiedText,
              isNearAddressSec ? 'text-gray-800' : ''
            )}
          </div>
        )}
        {!isNearAddress && !isNearAddressSec && renderEthAddress()}
        <CopyIcon size={copySize ?? 16} color='#60A5FA' {...copyIconProps} />
      </span>
    </div>
  );
};
