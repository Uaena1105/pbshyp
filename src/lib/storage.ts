import { S3Storage } from 'coze-coding-dev-sdk';

/**
 * 对象存储客户端（仅服务端使用）。
 * 注意：此模块依赖 S3 SDK，禁止被任何客户端组件引用。
 */
let storage: S3Storage | null = null;

export function getStorage(): S3Storage {
  if (!storage) {
    storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });
  }
  return storage;
}