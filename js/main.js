$(function () {
    var $select = $('#semester');
    var $current = $('#current-semester');

    if (!$select.length || !$current.length) return;

    function updateSemesterText() {
        var text = $select.find('option:selected').text() || '';
        $current.text(text);
        // persist selected semester value so other pages can read it
        try {
            localStorage.setItem('selectedSemester', $select.val() || '');
        } catch (e) {
            // ignore storage errors
        }
    }

    $select.on('change', updateSemesterText);
    updateSemesterText();

    function createCustomDropdown(nativeSelect) {
        var $native = $(nativeSelect);
        $native.css({ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0 });

        var $wrapper = $('<div/>', { 'class': 'custom-select', tabindex: 0 });
        var $button = $('<button/>', {
            type: 'button',
            'class': 'custom-selected',
            'aria-haspopup': 'listbox',
            'aria-expanded': 'false'
        }).text($native.find('option:selected').text() || '');

        var $list = $('<ul/>', { 'class': 'custom-options', role: 'listbox' });

        $native.find('option').each(function (idx) {
            var $opt = $(this);
            var $li = $('<li/>', {
                'class': 'custom-option',
                role: 'option',
                tabindex: 0,
                'data-value': $opt.val()
            }).text($opt.text());

            if (idx === nativeSelect.selectedIndex) $li.attr('aria-selected', 'true');

            $li.on('click', function () {
                $native.val($(this).data('value')).trigger('change');
                $button.text($(this).text());
                $list.find('.custom-option').removeAttr('aria-selected');
                $(this).attr('aria-selected', 'true');
                close();
            });

            $list.append($li);
        });

        function open() {
            $wrapper.addClass('open');
            $button.attr('aria-expanded', 'true');
        }

        function close() {
            $wrapper.removeClass('open');
            $button.attr('aria-expanded', 'false');
        }

        $button.on('click', function (e) {
            e.stopPropagation();
            if ($wrapper.hasClass('open')) close(); else open();
        });

        $(document).on('click', function (e) {
            if (!$.contains($wrapper[0], e.target)) close();
        });

        $wrapper.on('keydown', function (e) {
            var openNow = $wrapper.hasClass('open');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!openNow) open();
                var $first = $list.find('.custom-option').first();
                $first && $first.focus();
            } else if (e.key === 'Escape') {
                close();
            }
        });

        $list.on('keydown', '.custom-option', function (e) {
            var $focused = $(document.activeElement);
            if (!$focused.hasClass('custom-option')) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                var $next = $focused.next('.custom-option');
                if ($next.length) $next.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                var $prev = $focused.prev('.custom-option');
                if ($prev.length) $prev.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $focused.click();
            } else if (e.key === 'Escape') {
                close();
                $button.focus();
            }
        });

        $wrapper.append($button, $list);
        $native.after($wrapper);
    }

    createCustomDropdown($select[0]);
});

