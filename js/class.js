// js/class.js
// 依據首頁選擇的學期，自動取得該學期所有班級清單，並依學院/系所分群顯示
$(function () {
    // 直接指定 API base，不用 input
    var apiBase = 'https://gnehs.github.io/ntut-course-crawler-node/';
    var $semester = $('#semester');
    var $notice = $('#notice');
    var $results = $('#results');

    // 若首頁已選擇學期，嘗試從 localStorage 恢復並套用到下拉選單
    try {
        var saved = localStorage.getItem('selectedSemester');
        if (saved) {
            $semester.val(saved);
            // 若頁面有 current-semester 元素，更新其文字
            var $cur = $('#current-semester');
            if ($cur.length) $cur.text($semester.find('option:selected').text());
        }
    } catch (e) { }

    // 頁面載入自動查詢
    fetchApi();
    // 學期選單變動自動查詢
    $semester.on('change', function () {
        fetchApi();
        // 更新當前學期顯示
        $('#current-semester').text($('#semester option:selected').text());
    });

    function showNotice(msg, isError) {
        $notice.text(msg).css('color', isError ? '#b91c1c' : '#64748B');
    }

    function renderDepartmentList(data) {
        $('#results').empty();
        // 轉成陣列
        var arr = Array.isArray(data) ? data : Object.values(data);
        // 依 category 分群
        var grouped = {};
        arr.forEach(function (item) {
            var cat = item.category || '未分類';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
        });
        // 每個學院一個 card
        Object.keys(grouped).forEach(function (cat) {
            var $card = $('<div/>').addClass('college-card');
            $card.append($('<h2/>').text(cat));
            var $classList = $('<div/>').addClass('class-list');
            grouped[cat].forEach(function (cls) {
                var $cls = $('<a/>').attr('href', cls.href || '#')
                    .attr('target', '_blank')
                    .addClass('class-chip')
                    .text(cls.name || '(未命名班級)');
                $classList.append($cls);
            });
            $card.append($classList);
            $('#results').append($card);
        });
    }

    function fetchApi() {
        var url = apiBase;
        var semVal = $semester.val();
        if (semVal) {
            var m = semVal.match(/^(\d{3,4})[^\d]?(1|2)$/);
            if (!m) {
                var s = semVal;
                var last = s.slice(-1);
                if (last === '1' || last === '2') {
                    m = [semVal, s.slice(0, -1), last];
                }
            }
            if (m) {
                var year = m[1];
                var sem = m[2];
                if (url.slice(-1) !== '/') url += '/';
                url = url + encodeURIComponent(year) + '/' + encodeURIComponent(sem) + '/department.json';
            } else {
                url += (url.indexOf('?') === -1 ? '?' : '&') + 'semester=' + encodeURIComponent(semVal);
            }
        }
        showNotice('向 ' + url + ' 發出請求...', false);
        $results.html('');
        $.ajax({ url: url, method: 'GET', dataType: 'json', timeout: 10000 })
            .done(function (data) {
                showNotice('取得資料', false);
                renderDepartmentList(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                var msg = '取得失敗: ' + textStatus + (errorThrown ? ' - ' + errorThrown : '');
                var debugInfo = '<div class="debug-info">';
                debugInfo += '<b>API 請求失敗</b><br>';
                debugInfo += '請求網址: <code>' + url + '</code><br>';
                debugInfo += '狀態碼: ' + (jqXHR.status || '無') + '<br>';
                debugInfo += '錯誤訊息: ' + msg + '<br>';
                if (jqXHR && jqXHR.responseText) {
                    debugInfo += '<b>Response Text:</b><pre style="white-space:pre-wrap;">' + $('<div/>').text(jqXHR.responseText).html() + '</pre>';
                }
                debugInfo += '</div>';
                $results.html(debugInfo);
            });
    }

    function renderTableFromArray(arr) {
        if (!arr || !arr.length) {
            $('#results').html('<div class="text">沒有資料</div>');
            return;
        }
        var keys = Object.keys(arr[0]);
        var $table = $('<table/>').css({ width: '100%', borderCollapse: 'collapse' });
        var $thead = $('<thead/>');
        var $tr = $('<tr/>');
        keys.forEach(function (k) {
            $tr.append($('<th/>').text(k).css({ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e6e6e6' }));
        });
        $thead.append($tr);
        $table.append($thead);
        var $body = $('<tbody/>');
        arr.forEach(function (row) {
            var $r = $('<tr/>');
            keys.forEach(function (k) {
                var val = row[k] == null ? '' : row[k];
                $r.append($('<td/>').text(val).css({ padding: '8px', borderBottom: '1px solid #f0f0f0' }));
            });
            $body.append($r);
        });
        $table.append($body);
        $('#results').empty().append($table);
    }
});
