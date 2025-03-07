import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

interface InfoTooltipProps {
  text: string;
  trigger: JSX.Element;
  delay?: number;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, trigger, delay }) => {
  return (
    <TooltipProvider delayDuration={delay ?? 200}>
      <Tooltip>
        <TooltipTrigger>{trigger}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
