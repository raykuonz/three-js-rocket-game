import { scene } from "../main";
import { challengeRows, environmentBits } from "./objects";

export const garbageCollector = () => {

    let environmentObjectsForCollection = environmentBits.filter((x) => x.position.z > 100);
    let challengeRowsForCollection = challengeRows.filter((x) => x.rowParent.position.z > 100);

    for (let i = 0; i < environmentObjectsForCollection.length; i++) {
        let index = environmentBits.indexOf(environmentObjectsForCollection[i]);
        scene.remove(environmentBits[index]);
        environmentBits.splice(index, 1);
    }

    for (let i = 0; i < challengeRowsForCollection.length; i++) {
        const index = challengeRows.indexOf(challengeRowsForCollection[i]);
        scene.remove(challengeRowsForCollection[i].rowParent);

        challengeRows.splice(index, 1);

    }
}