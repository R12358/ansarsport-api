import { Test, TestingModule } from '@nestjs/testing';
import { GalleriesController } from './galleries.controller';

describe('GalleriesController', () => {
  let controller: GalleriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleriesController],
    }).compile();

    controller = module.get<GalleriesController>(GalleriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
