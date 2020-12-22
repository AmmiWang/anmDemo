window.onload = function (ev) {
  const increasing = new Increasing('myNumbers', 40);
  increasing.to(1050);

  const decline = new Decline('myTime', 1000);
  decline.to(0);

  const sort = new Sort('myList', 250, 100);
  sort.onChange([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  setTimeout(function (args) {
    sort.onChange([12, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  }, 3000);
  setTimeout(function (args) {
    sort.onChange([12, 4, 2, 3, 1, 5, 9, 7, 8, 6]);
  }, 6000);
  setTimeout(function (args) {
    sort.onChange([10, 12, 1, 2, 3, 4, 5, 6, 7, 8]);
  }, 9000);

  const main = new Main('myMain', 3000);
  main.add({num: 1000,name: '上海XX软件科技有限公司'});
  let i = 0;
  const a = setInterval(function (args) {
    main.add({num: Math.random() * 1000,name: '上海XX软件科技有限公司'});
    i++;
    if (i === 20) {
      clearInterval(a);
    }
  }, 1000);
};

/**
 * 递减实例
 * @param domId 需递减显示的节点ID
 * @param oneTime 每次递减的间隔（单位ms）
 * @constructor
 */
function Decline(domId, oneTime) {
  // 生成新实例时，记录两个参数，方便后边再更新的时候无需传入
  this.domId = domId;
  this.oneTime = oneTime;

  /**
   * 需要递减到的值
   * @param toNum
   */
  this.to = function (toNum) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      // 获取节点当前值
      const dom = document.getElementById(this.domId);
      // 获取当前节点的值
      const oldV = parseInt(dom.innerText);
      if (oldV === 0) {
        clearInterval(this.interval);
        return;
      }
      dom.innerText = (oldV - 1).toString();
    }, this.oneTime);
  }
}

/**
 * 递增实例
 * @param domId 需递增显示的节点ID
 * @param oneTime 每次递增的间隔（单位ms）
 * @constructor
 */
function Increasing(domId, oneTime) {
  // 生成新实例时，记录两个参数，方便后边再更新的时候无需传入
  this.domId = domId;
  this.oneTime = oneTime;

  /**
   * 需要递增到的值
   * @param toNum
   */
  this.to = function (toNum) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    // 定时器，每oneTime秒+1
    this.interval = setInterval(() => {
      // 获取节点当前值
      const dom = document.getElementById(this.domId);
      // 获取当前节点的值
      const oldV = Number(dom.innerText.replace(/,/g, ''));
      // 数字递增完之后，清空定时器
      if (oldV === toNum) {
        clearInterval(this.interval);
        return;
      }
      // 生成新值
      let newV = (oldV + 1).toString();
      // 结果值
      let res = newV;
      // Todo 这块其实可以做成三位数循环的，但就目前来看，这的数字基本不会超过亿，所以就没必要做了
      // 百万以上的逗号处理
      if (newV.length >= 7) {
        let last = newV.substring(newV.length - 3, newV.length);
        let center = newV.substring(newV.length - 6, newV.length - 3);
        let first = newV.substring(0, newV.length - 6);
        res = first + ',' + center + ',' + last;
        dom.innerText = res;
        return;
      }
      // 千以上，百万以下的逗号处理
      if (newV.length >= 4) {
        let last = newV.substring(newV.length - 3, newV.length);
        let first = newV.substring(0, newV.length - 3);
        res = first + ',' + last;
        dom.innerText = res;
        return;
      }
      dom.innerText = res;
    }, this.oneTime);
  }
}

/**
 * 排序实例
 * @param domId 列表节点ID
 * @param itemWidth 每项的宽度
 * @param itemHeight 每项的高度
 * @constructor
 */
function Sort(domId, itemWidth, itemHeight) {
  // 生成新实例时，记录三个参数，方便后边再更新的时候无需传入
  this.domId = domId;
  this.itemWidth = itemWidth;
  this.itemHeight = itemHeight;

  /**
   * 修改排序方法
   * @param newList 新的数据列表
   */
  this.onChange = function (newList) {
    // 获取所有列表项
    const items = document.getElementById(this.domId).children;
    // 存储空闲项
    const freeItems = [];
    // 记录移动过的项
    const movedItems = [];
    for (let i = 0; i < items.length; i++) {
      // 获取每个列表项的自定义属性
      const itemId = items[i].getAttribute('itemId');
      // 自定义属性值为空，或者自定义属性值不在新数据列表内，将该项存储空闲项数组，方便后续使用
      if (!itemId || !newList.includes(Number(itemId))) {
        // 清空列表项自定义属性值
        items[i].setAttribute('itemId', '');
        // 存入空闲项数组
        freeItems.push(items[i]);
        continue;
      }
      // 如存在，根据排序索引，移动项的位置，并存入移动项数组内
      movedItems.push(Number(itemId));
      // 获取该节点自定义属性值在新数据列表索引（即排序）
      const newIndex = newList.indexOf(Number(itemId));
      // 根据奇偶添加样式
      const isOdd = (newIndex % 2);
      items[i].style.top = isOdd ? ((newIndex - 1) / 2 * this.itemHeight + 'px') : (newIndex / 2 * this.itemHeight + 'px');
      items[i].style.left = isOdd ? this.itemWidth + 'px' : '0px';
    }
    for (let o = 0; o < newList.length; o++) {
      // 如该项移动过，则直接跳出
      if (movedItems.includes(newList[o])) {
        continue;
      }
      // 为空闲项添加自定义属性及值，走到这里的都是新增进来的项
      freeItems[0].setAttribute('itemId', newList[o]);
      const newIndex = o;
      // 根据奇偶添加样式
      const isOdd = (newIndex % 2);
      freeItems[0].style.top = isOdd ? ((newIndex - 1) / 2 * this.itemHeight + 'px') : (newIndex / 2 * this.itemHeight + 'px');
      freeItems[0].style.left = isOdd ? this.itemWidth + 'px' : '0px';
      // 空现项被操作后，从空闲项数组内移除，方便操作下一个空闲项
      freeItems.splice(0, 1);
    }
  }
}

function Main(domId, anmTime) {
  // 生成新实例时，记录两个参数，方便后边再更新的时候无需传入
  this.domId = domId;
  this.anmTime = anmTime;

  this.add = function (obj) {
    const dom = document.getElementById(this.domId);
    const item = document.createElement('div');
    item.setAttribute('class', 'main-item');
    const top = document.createElement('div');
    top.setAttribute('class', 'main-item-top');
    top.innerText = obj.num.toFixed(0);
    const bottom = document.createElement('div');
    bottom.setAttribute('class', 'main-item-bottom');
    bottom.innerText = obj.name;
    item.appendChild(top);
    item.appendChild(bottom);
    const itemSize = (obj.num / 5) < 100 ? 100 : (obj.num / 5);
    top.style.width = itemSize + 'px';
    top.style.height = itemSize + 'px';
    const position = Math.random() * 90 + 1;
    item.style.left = (position > 70 ? ('calc(' + position + '% - ' + itemSize + 'px)') : (position + '%'));
    dom.appendChild(item);
    setTimeout(() => {
      dom.removeChild(item);
    }, this.anmTime);
  }
}






























