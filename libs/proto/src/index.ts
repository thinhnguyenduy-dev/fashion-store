// Proto library exports
export * from './lib/proto.module';

// Proto file paths for gRPC client configuration
export const PROTO_PATHS = {
  PRODUCT: 'libs/proto/src/lib/product.proto',
  ORDER: 'libs/proto/src/lib/order.proto',
  INVENTORY: 'libs/proto/src/lib/inventory.proto',
  USER: 'libs/proto/src/lib/user.proto',
  AUTH: 'libs/proto/src/lib/auth.proto',
  CATEGORY: 'libs/proto/src/lib/category.proto',
};

// gRPC service package names
export const GRPC_PACKAGES = {
  PRODUCT: 'product',
  ORDER: 'order',
  INVENTORY: 'inventory',
  USER: 'user',
  AUTH: 'auth',
  CATEGORY: 'category',
};

// gRPC service names
export const GRPC_SERVICES = {
  PRODUCT_SERVICE: 'ProductService',
  ORDER_SERVICE: 'OrderService',
  INVENTORY_SERVICE: 'InventoryService',
  USER_SERVICE: 'UserService',
  AUTH_SERVICE: 'AuthService',
  CATEGORY_SERVICE: 'CategoryService',
};
