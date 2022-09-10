import { FC } from 'react';
import { ISize } from '../../interfaces/products';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];
    onSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({selectedSize, sizes, onSelectedSize}) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button key={size} size='small' color={selectedSize === size ? 'info' : 'primary'} 
                    sx={{backgroundColor: selectedSize === size ? 'primary.main' : 'info.main', "&:hover": {backgroundColor: selectedSize === size ? 'gray' : ''} }}
                    className={selectedSize === size ? 'btn1' : ''}
                    onClick={() =>onSelectedSize(size)}>
                    {size}
                </Button>
            ))
        }
    </Box>
  )
}
