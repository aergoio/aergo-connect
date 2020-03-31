import { IndexedDbStorage } from "@herajs/wallet";

const VERSION = 3;
const store = new IndexedDbStorage('data', VERSION);

export default store;