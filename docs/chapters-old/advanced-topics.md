# Advanced Topics in Educational MicroSims

## MicroSim Sequences

MicroSims can also be used in sequences where a simple concept is
introduced in the first MicroSim and additional concepts are slowly
added.  For example when the concept of an image convolution
is taught we begin with a simple MicroSim that shows a 
[sliding window](https://dmccreary.github.io/deep-learning-course/sims/sliding-window/) of a region of a matrix.
After that a simple [convolution](https://dmccreary.github.io/deep-learning-course/sims/convolution/)
operation such as sum or average is shown.  Next, a [Convolution with Filters](https://dmccreary.github.io/deep-learning-course/sims/convo-with-filters/) adds some initial complexity.  Finally, a [Convolution with Multiply](https://dmccreary.github.io/deep-learning-course/sims/conv-filter-mult/) is added.

At each stage we build up successively more concepts so that the student is not quickly overwhelmed by complexity.  This supports the concept of scaffold instructional design where complexity is slowly built up from a base of understanding.

## Integration with Intelligent Textbooks

MicroSims are ideally used as drop-in components within [intelligent textbooks](https://dmccreary.github.io/intelligent-textbooks/).  Intelligent Textbooks can be categorized into five levels of functionality:

### Level 1: Static Textbooks 

These textbooks are traditional printed or digital formats with no interactive elements. They are composed purely of text and static images, with fixed content that doesn't adapt to the learner. Over 90% of textbooks used by college students today remain at Level 1. They're suitable for simple content delivery where interaction isn't necessary.
        
### Level 2:Interactive Textbooks 

Level 2 textbooks incorporate digital elements that engage readers beyond passive consumption. Features include keyword search, hyperlinks, embedded videos, simple quizzes, AI-generated MicroSims, detailed glossary, social sharing compatibility, and usage analytics. These textbooks are cost-effective enhancements that improve engagement with multimedia elements.
        
### Level 3: Adaptive Textbooks

Adaptive textbooks dynamically adjust content based on user input, performance, and behavior. They use personalized learning pathways through deterministic rules, concept graph traversal algorithms, content selection based on assessment performance, and continuous recording of concept mastery. Implementation requires data management systems, graph algorithms, and raises privacy considerations.
        
### "Level 4: Textbooks with Chatbots 

Chatbot assisted textbooks integrate intelligent conversational interfaces providing real-time assistance. They use Large Language Models (LLMs) as tutoring assistants, employ GraphRAG architecture combining multiple AI technologies, and provide real-time feedback on student questions. These systems can balance between powerful LLMs and cost-effective smaller models for privacy and efficiency.
        
### Level 5: Autonomous AI

At the top level, autonomous AI textbooks represent the future of educational content where AI-driven systems fully understand individual learner needs and autonomously generate personalized learning experiences. They feature deep understanding of student knowledge, real-time generation of customized lessons, complete adaptability to learning styles, and human-like tutoring capabilities. This level remains aspirational, requiring advanced hardware and more reliable LLMs.

MicroSims first appear at level 2 interactive textbooks.  Although instructional designers use generative AI to create MicroSims, no LLMs are required to deploy and run level-2 textbooks in a classroom.

However, we have designed MicroSims to also quickly integrate with level-3 adaptive textbooks by feeding event
streams from the controls area of a MicroSim into a learning data store (LDS) using the xAPI.  My clearly placing
controls in a fixed region of the screen adding around 50 lines of xAPI JavaScript can be easily accomplished with most modern generative AI tools.
