import { connection } from '../db/connection';

export async function listProducts() {
  const products = await connection('product');

  return products;
}

export async function findProduct({ id }) {
  const product = await connection('product').whereRaw('id = ?', [id]).first();

  return product;
}

export async function CreateProduct({
  name,
  description,
  img_url,
  price,
  rating,
  category_id,
}) {
  const trx = await connection.transaction();
  try {
    const insertedProductId = await trx('product').insert({
      name,
      description,
      img_url,
      price: parseFloat(price),
      rating: parseFloat(rating),
      created_at: Date.now(),
      updated_at: Date.now(),
      user_id: '1',
    });
    const product_id = insertedProductId[0];

    await trx('product_category').insert({
      product_id,
      category_id,
    });

    await trx.commit();

    const createdProduct = await findProduct({ id: product_id });

    return createdProduct;
  } catch (error) {
    await trx.rollback();

    throw new Error('Server side error to create a new product');
  }
}

export async function DeleteProduct({ id }) {
  await connection('product').whereRaw('id = ?', [id]).del();

  return true;
}

export async function UpdateProduct() {}