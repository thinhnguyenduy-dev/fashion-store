// Proto library exports
export * from './lib/proto.module';

// Proto file paths for gRPC client configuration
export const PROTO_PATHS = {
  PRODUCT: 'libs/proto/src/lib/product.proto',
  ORDER: 'libs/proto/src/lib/order.proto',
  INVENTORY: 'libs/proto/src/lib/inventory.proto',
  USER: 'libs/proto/src/lib/user.proto',
};

// gRPC service package names
export const GRPC_PACKAGES = {
  PRODUCT: 'product',
  ORDER: 'order',
  INVENTORY: 'inventory',
  USER: 'user',
};

// gRPC service names
export const GRPC_SERVICES = {
  PRODUCT_SERVICE: 'ProductService',
  ORDER_SERVICE: 'OrderService',
  INVENTORY_SERVICE: 'InventoryService',
  USER_SERVICE: 'UserService',
};
