document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('semester');
    const current = document.getElementById('current-semester');

    if (!select || !current) return;

    function updateSemesterText() {
        // use the visible option text (e.g. "114 上學期")
        const text = select.options[select.selectedIndex]?.text || '';
        current.textContent = text;
    }

    // update on change
    select.addEventListener('change', updateSemesterText);

    // initialize on load
    updateSemesterText();

    /*
     Create a lightweight custom dropdown to allow styling the popup (options list).
     This keeps the original <select> for form submission but hides it visually.
    */
    function createCustomDropdown(nativeSelect) {
        // visually hide native select but keep it accessible
        nativeSelect.style.position = 'absolute';
        nativeSelect.style.opacity = 0;
        nativeSelect.style.pointerEvents = 'none';
        nativeSelect.style.width = '0';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select';
        wrapper.tabIndex = 0;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'custom-selected';
        button.setAttribute('aria-haspopup', 'listbox');
        button.setAttribute('aria-expanded', 'false');
        button.textContent = nativeSelect.options[nativeSelect.selectedIndex]?.text || '';

        const list = document.createElement('ul');
        list.className = 'custom-options';
        list.setAttribute('role', 'listbox');

        Array.from(nativeSelect.options).forEach((opt, idx) => {
            const li = document.createElement('li');
            li.className = 'custom-option';
            li.setAttribute('role', 'option');
            li.dataset.value = opt.value;
            li.textContent = opt.text;
            if (idx === nativeSelect.selectedIndex) li.setAttribute('aria-selected', 'true');
            list.appendChild(li);

            li.addEventListener('click', function (e) {
                // update native select
                nativeSelect.value = this.dataset.value;
                nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                // update button text
                button.textContent = this.textContent;
                // mark selected
                list.querySelectorAll('.custom-option').forEach(o => o.removeAttribute('aria-selected'));
                this.setAttribute('aria-selected', 'true');
                close();
            });
        });

        function open() {
            wrapper.classList.add('open');
            button.setAttribute('aria-expanded', 'true');
        }

        function close() {
            wrapper.classList.remove('open');
            button.setAttribute('aria-expanded', 'false');
        }

        button.addEventListener('click', function (e) {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) close(); else open();
        });

        // close when clicking outside
        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) close();
        });

        // keyboard support (basic)
        wrapper.addEventListener('keydown', function (e) {
            const openNow = wrapper.classList.contains('open');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!openNow) open();
                const first = list.querySelector('.custom-option');
                first && first.focus();
            } else if (e.key === 'Escape') {
                close();
            }
        });

        // allow option keyboard navigation
        list.addEventListener('keydown', function (e) {
            const focused = document.activeElement;
            if (!focused.classList.contains('custom-option')) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const next = focused.nextElementSibling;
                if (next) next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prev = focused.previousElementSibling;
                if (prev) prev.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                focused.click();
            } else if (e.key === 'Escape') {
                close();
                button.focus();
            }
        });

        // make options focusable
        list.querySelectorAll('.custom-option').forEach(li => li.tabIndex = 0);

        wrapper.appendChild(button);
        wrapper.appendChild(list);

        // insert wrapper after native select
        nativeSelect.parentNode.insertBefore(wrapper, nativeSelect.nextSibling);
    }

    // create the custom dropdown for this select
    createCustomDropdown(select);
});
