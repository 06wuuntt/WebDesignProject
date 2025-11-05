$(function () {
    // 定義每個班級的課程資料
    const classContent = {
        '1': {
            title: '光電一',
            courses: [
                { name: '微積分', teacher: '吳舜堂', location: '三教 109' },
                { name: '物理', teacher: '王耀德', location: '二教 306' },
                { name: '國文', teacher: '許瑞哲', location: '二教 306' },
                { name: '化學(一)', teacher: '張俊賢', location: '六教 527' },
                { name: '全民國防教育', teacher: '陳嘉嘉', location: '二教 305' }
            ]
        },
        '2': {
            title: '光電二',
            courses: [
                { name: '電路學(一)', teacher: '陳殿榮', location: '億光1035' },
                { name: '電磁學', teacher: '王耀德', location: '二教 207' },
                { name: '幾何光學', teacher: '陳建銘', location: '三教 201' },
                { name: '工程數學', teacher: '李穎玟', location: '三教 201' },
            ]
        },
        '3': {
            title: '光電三',
            courses: [
                { name: '近代物理', teacher: '陳美杏', location: '億光 1035' },
                { name: '電子學(二)', teacher: '王子建', location: '億光 1035' },
            ]
        },
        '4': {
            title: '光電四',
            courses: [
                { name: '光電系統設計', teacher: '鄭鈺潔', location: '共科 412' },
                { name: '光感測元件與系統', teacher: '彭朋群', location: '億光 0935' }
            ]
        }
    };

    // 按鈕點擊事件
    $('.button').on('click', function () {
        // 移除所有按鈕的 active 狀態
        $('.button').removeClass('active');

        // 添加當前按鈕的 active 狀態
        $(this).addClass('active');

        // 獲取按鈕的 data-class 屬性
        const classId = $(this).data('class');

        // 獲取課程資料
        const classData = classContent[classId];

        // 生成課程卡片 HTML
        let cardsHTML = '';
        classData.courses.forEach(course => {
            cardsHTML += `
                <div class="course-card">
                    <h3 class="course-name">${course.name}</h3>
                    <div class="course-info">
                        <p><i class="fa-solid fa-chalkboard-user"></i> ${course.teacher}</p>
                        <p><i class="fa-solid fa-location-dot"></i> ${course.location}</p>
                    </div>
                </div>
            `;
        });

        // 更新內容顯示區域
        $('#content-display').html(`
            <div class="course-grid">
                ${cardsHTML}
            </div>
        `);
    });
});