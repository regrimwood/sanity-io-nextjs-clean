import { Box, BoxProps, styled } from '@mui/material';
import React from 'react';

const StyledBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    paddingLeft: theme.spacing(1.875),
    paddingRight: theme.spacing(1.875),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(3.75),
    paddingRight: theme.spacing(3.75),
  },
}));

function ContentContainer(props: BoxProps, ref: React.Ref<HTMLDivElement>) {
  const { width, ...restProps } = props;

  return <StyledBox ref={ref} {...restProps} width={width ?? '100%'} />;
}

export default React.forwardRef<HTMLDivElement, BoxProps>(ContentContainer);
