# Flashcards App

[Run the flashcard application](./flashcards.html){ .md-button .md-button--primary }

## Sample Decomposition Prompt

```linenums="0"
I want to create a web application that displays 300 flashcards to help me learn the meaning of the 300 most common words in Tagalog.  How can we decompose this into smaller functions?
```

## Sample Decomposition Response

Creating a web application to display flashcards for learning the 300 most common words in Tagalog is a great idea. To make this project manageable and organized, we can decompose it into smaller functions and components. Here's a suggested breakdown:

1.  **Data Collection and Preparation**

    -   **Function to Fetch Word Data:** Develop a function to gather the 300 most common Tagalog words. This might involve scraping a website or using an existing dataset.
    -   **Data Structuring Function:** Design a structure to hold word data, including the Tagalog word, its English translation, and any additional data like usage examples or pronunciation guides.
2.  **Flashcard Generation**

    -   **Flashcard Object Creation:** Create a class or structure for a flashcard, encapsulating all necessary data (Tagalog word, English translation, examples, etc.).
    -   **Flashcard Display Logic:** Develop a function to display a single flashcard with its content, including front (Tagalog word) and back (translation, examples).
3.  **User Interface (UI) Design**

    -   **Main Layout:** Design the main layout of the web application, considering where the flashcards will be displayed, navigation buttons, and any other necessary interface elements.
    -   **Flashcard UI Component:** Create a UI component for the flashcard that can flip or reveal additional information upon user interaction.
    -   **Navigation Controls:** Implement UI controls for moving between flashcards (next, previous, random).
4.  **Interactivity and User Progress Tracking**

    -   **Progress Tracking Function:** Develop a system to track the user's progress, such as which flashcards have been seen and any scoring or mastery system you want to include.
    -   **Review and Testing Mechanisms:** Optionally, add features for users to test themselves, like quizzes or a mode where they must recall the translation before seeing it.
5.  **Data Persistence**

    -   **Local Storage or Database Integration:** Decide on and implement a method to store user progress, either locally in the browser or in a backend database.
6.  **Backend Development (if needed)**

    -   **Server-side Functions:** If your app requires a backend, develop the necessary APIs for fetching flashcard data, saving progress, and any other server-side logic.
    -   **Database Management:** Set up a database to manage the flashcards data and user progress, if not stored locally.
7.  **Testing and Quality Assurance**

    -   **Unit Testing for Functions:** Write tests for individual functions to ensure they work as expected.
    -   **Integration Testing:** Test how different parts of your application work together.
    -   **User Acceptance Testing:** Get feedback from potential users to see if the app meets their needs and is user-friendly.
8.  **Deployment**

    -   **Deployment Setup:** Prepare your application for deployment, which may include setting up a web server, domain, etc.
    -   **Launch:** Deploy your application to a web server or hosting service.
9.  **Maintenance and Updates**

    -   **Regular Maintenance:** Plan for regular checks and maintenance of your application.
    -   **Feature Updates:** Consider potential future updates, like adding more words or functionalities based on user feedback.

By breaking down the project into these smaller components, you can manage the workload more effectively and ensure each part of your application is well-designed and functional.

## Sample 30-Element Wordlist Prompt

```linenums="0"
Create a list of the 30 most common words
in Tagalog that are used by visitors.
Place them in a JSON file with their English translations.
```

## Sample Response

```json
[
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
]
```
