// Assuming your JSON data is in a variable called 'wordList'
const wordList = [
    {"Tagalog": "ang", "English": "the"},
    {"Tagalog": "ako", "English": "I"},
    {"Tagalog": "siya", "English": "he/she"},
    {"Tagalog": "sa", "English": "in/on"},
    {"Tagalog": "ng", "English": "of"},
    {"Tagalog": "ay", "English": "is"},
    {"Tagalog": "may", "English": "have"},
    {"Tagalog": "at", "English": "and"},
    {"Tagalog": "ito", "English": "this"},
    {"Tagalog": "mo", "English": "your"},
    {"Tagalog": "para", "English": "for"},
    {"Tagalog": "hindi", "English": "not/no"},
    {"Tagalog": "na", "English": "already"},
    {"Tagalog": "mga", "English": "plural marker"},
    {"Tagalog": "ko", "English": "my"},
    {"Tagalog": "ka", "English": "you"},
    {"Tagalog": "kami", "English": "we (exclusive)"},
    {"Tagalog": "kayo", "English": "you (plural)"},
    {"Tagalog": "sila", "English": "they"},
    {"Tagalog": "tayo", "English": "we (inclusive)"},
    {"Tagalog": "oo", "English": "yes"},
    {"Tagalog": "hindi", "English": "no"},
    {"Tagalog": "kung", "English": "if"},
    {"Tagalog": "isa", "English": "one"},
    {"Tagalog": "dalawa", "English": "two"},
    {"Tagalog": "tatlo", "English": "three"},
    {"Tagalog": "apat", "English": "four"},
    {"Tagalog": "lima", "English": "five"},
    {"Tagalog": "anim", "English": "six"},
    {"Tagalog": "pito", "English": "seven"}
];

let currentIndex = 0;

function displayWord() {
    document.getElementById('word').textContent = wordList[currentIndex].Tagalog;
    document.getElementById('definition').textContent = '';
}

function showDefinition() {
    document.getElementById('definition').textContent = wordList[currentIndex].English;
}

function nextWord() {
    currentIndex = (currentIndex + 1) % wordList.length;
    displayWord();
}

document.getElementById('showDefinition').addEventListener('click', showDefinition);
document.getElementById('nextWord').addEventListener('click', nextWord);

// Initial word display
displayWord();
