import React from 'react';
import { Button as ButtonUnstyled, ButtonProps } from '@mui/base';
import {
  alpha,
  CircularProgress,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { animated, useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { BackgroundContext } from '../BackgroundContext';

const AnimatedButton = styled(animated(ButtonUnstyled))(({ theme, width }) => ({
  width,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: `${theme.spacing(1.875)} ${theme.spacing(3.625)}`,
  borderRadius: '30px',
  whiteSpace: 'nowrap',
  border: `1px solid ${alpha(theme.palette.common.charcoal, 0.5)}`,

  '&:disabled': {
    cursor: 'default',
  },
}));

const AnimatedCircularProgress = animated(CircularProgress);
const AnimatedTypography = animated(Typography);

interface Props extends ButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  width?: string;
  loading?: boolean;
}

export default function Button(props: Props) {
  const { label, onClick, href, width = '100%', loading, ...restProps } = props;

  const theme = useTheme();
  const { lightBeige, beige, charcoal } = theme.palette.common;
  const { isLight } = React.useContext(BackgroundContext);

  const [isHovering, setIsHovering] = React.useState(false);

  const baseColor = isLight ? lightBeige : beige;

  const bind = useGesture({
    onHover: ({ hovering }) => {
      setIsHovering(hovering ?? false);
    },
  });

  const spring = useSpring({
    backgroundColor: isHovering && !loading ? charcoal : baseColor,
    borderColor: isHovering && !loading ? charcoal : alpha(charcoal, 0.2),
    color: isHovering && !loading ? baseColor : charcoal,
  });

  const { opacityCircle, opacityText } = useSpring({
    opacityCircle: loading ? 1 : 0,
    opacityText: loading ? 0 : 1,
  });

  return (
    <AnimatedButton
      {...bind()}
      style={spring}
      onClick={onClick}
      href={href}
      width={width}
      {...restProps}
    >
      {loading && (
        <AnimatedCircularProgress
          style={{ opacity: opacityCircle }}
          size={25}
          thickness={2}
          sx={{ position: 'absolute', color: 'inherit' }}
        />
      )}
      <AnimatedTypography style={{ opacity: opacityText }} variant="button">
        {label}
      </AnimatedTypography>
    </AnimatedButton>
  );
}
