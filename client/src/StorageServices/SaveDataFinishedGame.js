export default function saveGameData(score) {
    try {
        const previousURL = localStorage.getItem("previousURL");
        if (previousURL) {
            const url = new URL(previousURL);
            const gameData = url.searchParams.get("Game");
            const age = url.searchParams.get("Age");

            if (gameData && age) {
                const key = `${gameData}_${age}_bestScore`;
                const storedScore = parseInt(localStorage.getItem(key) || "0", 10);

                if (score > storedScore) {
                    localStorage.setItem(key, score.toString());
                }

                const typeMedal = age.toLowerCase() === "easy"
                    ? "BronzeMedal"
                    : age.toLowerCase() === "medium"
                        ? "SilverMedal"
                        : "GoldMedal";

                const medalKey = `${gameData}_${typeMedal}`;
                const medalStatus = localStorage.getItem(medalKey) === "1";
                if (!medalStatus) {
                    localStorage.setItem(medalKey, "1");
                }
            }
        }
    } catch (error) {
        console.error("Error processing score or medal update:", error);
    }
}