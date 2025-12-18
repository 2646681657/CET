// 页面逻辑
Page({
  data: {
    // 状态数据
    currentType: 4, // 4级或6级
    currentDifficulty: '难', // 难/中/易
    
    // 输入数据 - 初始为空字符串，不显示0
    listening: {
      conversation: '',
      passage: '',
      lecture: ''
    },
    reading: {
      fill: '',
      long: '',
      careful: ''
    },
    writing: '',
    translation: '',
    
    // 结果数据
    finalScore: 0,
    // 评分标准显示状态
    isScoreStandardVisible: false
  },

  // 切换考试类型
  switchType: function(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      currentType: type
    });
  },

  // 切换难度
  switchDifficulty: function(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({
      currentDifficulty: difficulty
    });
  },

  // 输入事件处理
  onInput: function(e) {
    const type = e.currentTarget.dataset.type;
    let value = e.detail.value;
    

    let min = 0;
    let max = 0;
    
    switch(type) {
      // 听力部分
      case 'listening-conversation': max = 8; break;
      case 'listening-passage': max = 7; break;
      case 'listening-lecture': max = 10; break;
      // 阅读部分
      case 'reading-fill': max = 10; break;
      case 'reading-long': max = 10; break;
      case 'reading-careful': max = 10; break;
      // 写作翻译部分
      case 'writing': 
      case 'translation': 
        min = 0; 
        max = 15; 
        break;
      default: 
        max = 10;
    }
    
    // 验证输入值
    let numValue = parseFloat(value);
    
    // 处理空值
    if (isNaN(numValue) || value === '') {
      numValue = min;
    }
    
    // 限制范围
    numValue = Math.max(min, Math.min(max, numValue));
    
    // 更新数据 - 对于听力和阅读，输入时转换为数字；对于写作翻译，保持数字类型
    const updateData = {};
    if (type.includes('listening')) {
      const subType = type.split('-')[1];
      updateData[`listening.${subType}`] = value === '' ? '' : parseInt(numValue);
    } else if (type.includes('reading')) {
      const subType = type.split('-')[1];
      updateData[`reading.${subType}`] = value === '' ? '' : parseInt(numValue);
    } else {
      updateData[type] = value === '' ? '' : parseFloat(numValue);
    }
    
    this.setData(updateData);
  },

  // 切换评分标准显示/隐藏
  toggleScoreStandard: function() {
    this.setData({
      isScoreStandardVisible: !this.data.isScoreStandardVisible
    });
  },

  // 计算分数按钮点击事件
  calculateScore: function() {
    const { listening, reading, writing, translation } = this.data;
    
    // 将空字符串转换为数字0进行计算
    const getNumValue = (value) => {
      return value === '' || isNaN(value) ? 0 : parseFloat(value);
    };
    
    // 计算听力原始分 (每题1分)
    const listeningRaw = getNumValue(listening.conversation) + getNumValue(listening.passage) + getNumValue(listening.lecture)* 2;
    // 听力满分25题，转换为248.5分
    const listeningScore = (listeningRaw / 35) * 248.5;

    // 计算阅读原始分
    // 选词填空：0.5分/题，长篇阅读：1分/题，仔细阅读：2分/题
    const readingRaw = (getNumValue(reading.fill) * 0.5) + getNumValue(reading.long) + (getNumValue(reading.careful) * 2);
    // 阅读满分35分，转换为248.5分
    const readingScore = (readingRaw / 35) * 248.5;

    // 写作翻译总分
    const writingTranslationRaw = getNumValue(writing) + getNumValue(translation);
    const writingTranslationScore = (writingTranslationRaw / 30) * 212;

    // 最终预估分 (四舍五入取整)
    const finalScore = Math.round(listeningScore + readingScore + writingTranslationScore);

    // 更新UI
    this.setData({
      finalScore: finalScore
    });
  }
});