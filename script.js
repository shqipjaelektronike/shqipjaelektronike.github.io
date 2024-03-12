document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const definitionTitle = document.getElementById('definitionTitle');
    const definitionContent = document.getElementById('definitionContent');
    let dictionary;

    // Fetch the dictionary data
    fetch('dictionary.json')
        .then(response => response.json())
        .then(data => {
            dictionary = data;
            // Enable search functionality after data is loaded
            enableSearch();
        });

    // Function to display search results
    function displayResults(results, query) {
        // Sort the results alphabetically
        results.sort((a, b) => a.localeCompare(b));
        
        searchResults.innerHTML = '';
        results.forEach((word, index) => {
            const li = document.createElement('li');
            li.innerHTML = highlightMatch(word, query);
            searchResults.appendChild(li);
        });
        selectFirstResult(); // Select the first result if available
    }


    // Function to highlight matching letters in search results
    function highlightMatch(word, query) {
        let index = word.toLowerCase().indexOf(query.toLowerCase());
        if (index !== -1) {
            const matchedPart = word.substring(index, index + query.length);
            const highlightedWord = word.substring(0, index) + '<strong>' + matchedPart + '</strong>' + word.substring(index + query.length);
            return `<span>${highlightedWord}</span>`;
        } else {
            return word;
        }
    }

    // Function to show word definition
    function showDefinition(word) {
        if (word === '' || !dictionary[word]) {
            definitionTitle.textContent = ''; // Clear definition title
            definitionContent.textContent = ''; // Clear definition content
        } else {
            definitionTitle.textContent = word; // Set definition title
            definitionContent.textContent = dictionary[word]; // Set definition content
            searchResults.innerHTML = ''; // Clear search results when definition is shown
        }
    }

    // Function to enable search functionality
    function enableSearch() {
        // Event listener for input
        searchInput.addEventListener('input', function() {
            const query = this.value.trim(); // Trim whitespace
            if (query === '') {
                searchResults.innerHTML = ''; // Clear the search results if the input is empty
                showDefinition(''); // Clear definition if search input is empty
            } else {
                const results = Object.keys(dictionary).filter(word => word.toLowerCase().startsWith(query.toLowerCase()));
                displayResults(results, query);
            }
        });

        // Event listener for Enter key press
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                const selectedWord = searchResults.querySelector('li.selected');
                if (selectedWord) {
                    searchInput.value = selectedWord.textContent;
                    showDefinition(selectedWord.textContent);
                }
            }
        });

        // Event listener for click on search results
        searchResults.addEventListener('click', function(event) {
            const clickedWord = event.target.closest('li');
            if (clickedWord) {
                searchInput.value = clickedWord.textContent;
                showDefinition(clickedWord.textContent);
                // Highlight clicked word
                clearSelection();
                clickedWord.classList.add('selected');
            }
        });

        // Highlight selected word in search results
        searchInput.addEventListener('keydown', function(event) {
            const selectedWord = searchResults.querySelector('li.selected');
            if (event.key === 'ArrowDown') {
                if (selectedWord && selectedWord.nextSibling) {
                    selectedWord.classList.remove('selected');
                    selectedWord.nextSibling.classList.add('selected');
                } else if (!selectedWord) {
                    selectFirstResult();
                }
                event.preventDefault(); // Prevent cursor from moving in input field
            } else if (event.key === 'ArrowUp') {
                if (selectedWord && selectedWord.previousSibling) {
                    selectedWord.classList.remove('selected');
                    selectedWord.previousSibling.classList.add('selected');
                }
                event.preventDefault(); // Prevent cursor from moving in input field
            }
        });

        // Event listener to clear definition when typing starts
        searchInput.addEventListener('input', function() {
            showDefinition(''); // Clear definition when typing starts
        });
    }

    // Function to select the first search result
    function selectFirstResult() {
        const firstResult = searchResults.querySelector('li');
        if (firstResult) {
            firstResult.classList.add('selected');
        }
    }

    // Function to clear selection from all search results
    function clearSelection() {
        const selectedWords = searchResults.querySelectorAll('li.selected');
        selectedWords.forEach(word => {
            word.classList.remove('selected');
        });
    }
});
