document.addEventListener('DOMContentLoaded', function() {
    const queryParams = new URLSearchParams(window.location.search);
    const mdFile = queryParams.get('mdFile');

    if (mdFile) {
        loadMarkdown(mdFile);
    }

    if (document.getElementById('markdown-viewer')) {
        // 仅在 index.html 页面上执行
        const markdownViewer = document.getElementById('markdown-viewer');
        const problemIframe = document.getElementById('problem-iframe');

        window.openProblem = function(mdFile) {
            markdownViewer.style.right = '0'; // Slide the viewer in
            problemIframe.src = `problem_viewer.html?mdFile=${mdFile}`;
        };

        window.closeProblem = function() {
            markdownViewer.style.right = '-50%'; // Slide the viewer out
            setTimeout(() => {
                problemIframe.src = ''; // Clear the iframe source after the viewer has hidden
            }, 500);
        };

        // Function to handle clicking outside the problem viewer to close it
        window.checkClose = function(event) {
            if (event.target === document.querySelector('.content')) {
                closeProblem();
            }
        };

        // Add click listener to the content area to close the viewer if clicked outside the viewer area
        document.querySelector('.content').addEventListener('click', function(event) {
            checkClose(event);
        });
    }

    function loadMarkdown(filename) {
        fetch(filename)
            .then(response => response.text())
            .then(text => {
                const markdownContent = document.getElementById('markdown-content');
                markdownContent.innerHTML = marked.parse(text);
                addCopyButtons();
            })
            .catch(error => {
                console.error('Error loading markdown file:', error);
                markdownContent.innerHTML = `<p>Error loading content: ${error}</p>`;
            });
    }

    function addCopyButtons() {
        document.querySelectorAll('pre code').forEach((block) => {
            const button = document.createElement('button');
            button.textContent = 'Copy';
            button.className = 'copy-btn';
            button.onclick = () => {
                navigator.clipboard.writeText(block.innerText).then(() => {
                    alert('Copied to clipboard');
                }, (err) => {
                    alert('Failed to copy text: ', err);
                });
            };
            block.parentNode.insertBefore(button, block.nextSibling);
        });
    }

    window.copyToClipboard = function() {
        navigator.clipboard.readText().then(text => {
            alert('Text from clipboard: ' + text);
        }).catch(err => {
            alert('Failed to read from clipboard: ' + err);
        });
    };
});

// 修改 "题目详细" 按钮的行为，以在顶层窗口中打开 problem.html
function openDetailPage() {
    window.top.location.href = 'problem.html';
}
