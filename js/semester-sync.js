// js/semester-sync.js
// Centralized semester persistence and restoration
$(function () {
    var $s = $('#semester');
    if (!$s.length) return;

    try {
        var saved = localStorage.getItem('selectedSemester');
        if (saved) {
            $s.val(saved);
        } else {
            // ensure there's an initial saved value
            localStorage.setItem('selectedSemester', $s.val() || '');
        }
    } catch (e) {
        // ignore
    }

    // Update any visible current-semester text
    var $cur = $('#current-semester');
    if ($cur.length) {
        $cur.text($s.find('option:selected').text() || '');
    }

    // keep localStorage in sync when user changes selection
    $s.on('change', function () {
        try { localStorage.setItem('selectedSemester', $s.val() || ''); } catch (e) { }
        if ($cur.length) $cur.text($s.find('option:selected').text() || '');
    });

    // Trigger a change so other scripts/listeners pick it up (but avoid double work)
    $s.trigger('change');
});