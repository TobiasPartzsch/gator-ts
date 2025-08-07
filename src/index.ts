import { readConfig, setUser } from "./config";
function main() {
    setUser("Tobias");
    const cfg = readConfig();
    console.log(cfg);
}

main();
