import { Templates } from "./Templates";

export type Config = {
  autoCheck: boolean;
  defaultTemplate: keyof Templates
}
