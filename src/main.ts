import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  // Enable CORS
  app.enableCors();
  await app.listen(port);
  console.log("Hi There! App started on port " + port);
}
bootstrap();
