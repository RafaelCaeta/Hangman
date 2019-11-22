const words = ["3dhubs", "marvin", "print", "filament", "order", "layer"];

export function getRandomWord() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(words[Math.floor(Math.random() * words.length)]);
        }, 1000);
    });    
} 
 