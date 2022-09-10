import { FC } from "react"
import { IProduct } from "../../interfaces/products"
import { Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { ProductCard } from "./ProductCard";

interface Props {
    products: IProduct[]
}

export const ProductList: FC<Props> = ({products}) => {
  return (
    <Grid container spacing={4}>
          {
            products.map(product => (
              <ProductCard key={product.slug} product={product} />
            ))
          }
      </Grid>
  )
}
