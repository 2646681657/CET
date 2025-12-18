// 全局状态
let currentType = 4; // 4级或6级
let currentDifficulty = '难'; // 难/中/易

// 初始化
function init() {
    bindEvents();
    calculateScore();
}

// 绑定事件
function bindEvents() {
    // 四六级切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.tab-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentType = parseInt(btn.dataset.type);
            calculateScore();
        });
    });

    // 难度切换
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.difficulty-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
            document.getElementById('difficulty-tag').textContent = `（${currentDifficulty}）`;
            calculateScore();
        });
    });

    // 输入框事件
    document.querySelectorAll('.item-input').forEach(input => {
        // 输入时实时计算
        input.addEventListener('input', (e) => {
            validateInput(e.target);
            calculateScore();
        });

        // 失焦时确保值在范围内
        input.addEventListener('blur', (e) => {
            validateInput(e.target);
            calculateScore();
        });
    });
}

// 验证输入值
function validateInput(input) {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    let value = parseFloat(input.value);

    // 处理空值
    if (isNaN(value)) {
        value = min;
    }

    // 限制范围
    value = Math.max(min, Math.min(max, value));
    
    // 更新输入框值
    input.value = value;
}

// 计算分数
function calculateScore() {
    // 获取输入值
    const listening = {
        conversation: parseInt(document.getElementById('listening-conversation').value),
        passage: parseInt(document.getElementById('listening-passage').value),
        lecture: parseInt(document.getElementById('listening-lecture').value)
    };

    const reading = {
        fill: parseInt(document.getElementById('reading-fill').value),
        long: parseInt(document.getElementById('reading-long').value),
        careful: parseInt(document.getElementById('reading-careful').value)
    };

    const writing = parseFloat(document.getElementById('writing').value);
    const translation = parseFloat(document.getElementById('translation').value);

    // 计算听力原始分 (每题1分)
    const listeningRaw = listening.conversation + listening.passage + listening.lecture;
    // 听力满分25题，转换为248.5分
    const listeningScore = (listeningRaw / 35) * 248.5;

    // 计算阅读原始分
    // 选词填空：0.5分/题，长篇阅读：1分/题，仔细阅读：2分/题
    const readingRaw = (reading.fill * 0.5) + reading.long + (reading.careful * 2);
    // 阅读满分35分，转换为248.5分
    const readingScore = (readingRaw / 35) * 248.5;

    // 写作翻译总分
    const writingTranslationScore = (writing/15)*106.5 + (translation/15)*106.5;

    // 原始总分
    let rawScore = listeningScore + readingScore + writingTranslationScore;
    rawScore = Math.round(rawScore * 10) / 10; // 保留一位小数

    // 难度修正
    let difficultyFactor = 0;
    if (currentDifficulty === '难') {
        difficultyFactor = 0.1; // +10%
    } else if (currentDifficulty === '易') {
        difficultyFactor = -0.1; // -10%
    }

    const adjustedScore = Math.round(rawScore * (1 + difficultyFactor) * 10) / 10;
    
    // 最终预估分 (四舍五入取整)
    const finalScore = Math.round(adjustedScore);



    // 更新UI
    document.getElementById('raw-score').textContent = rawScore;
    document.getElementById('adjusted-score').textContent = adjustedScore;
    document.getElementById('final-score').textContent = finalScore;
    
    const judgmentElement = document.getElementById('judgment');
    judgmentElement.textContent = judgment;
    judgmentElement.className = `result-value judgment ${judgment}`;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);