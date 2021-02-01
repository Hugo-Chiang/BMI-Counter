// 變數宣告
const submitButton = document.querySelector('#submitButton');
const resultCircle = document.querySelector('.resultCircle');
const heightField = document.querySelector('#heightField');
const weightField = document.querySelector('#weightField');
const bmiResultsList = document.querySelector('#bmiResultsList');
const deleteAllButton = document.querySelector('#deleteAllButton');
let bmiStatusColors = {
    underWeight: {
        color: '#31BAF9'
    },
    normalRange: {
        color: '#86D73E'
    },
    obeseLevel01: {
        color: '#FF982D'
    },
    obeseLevel02: {
        color: '#FF1200'
    },
    obeseLevel03: {
        color: '#FF1200'
    },
    obeseLevel04: {
        color: '#FF1200'
    },
}
let storageArr = JSON.parse(localStorage.getItem('storageData')) || [];

// 監聽事件
submitButton.addEventListener('click', submitCalculation);
bmiResultsList.addEventListener('click', deleteSingleRow);
deleteAllButton.addEventListener('click', deleteWholeList);

heightField.addEventListener('change', function () {
    if (heightField.value < 30) {
        heightField.value = 30;
    } else if (heightField.value > 250) {
        heightField.value = 250;
    }
});

weightField.addEventListener('change', function () {
    if (weightField.value < 0.3) {
        weightField.value = 0.3;
    } else if (weightField.value > 300) {
        weightField.value = 300;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.keyCode == 13) {
        submitCalculation();
    }
});

// 紀錄列表初始更新
updateResultsList();

// 函式：遞交BMI計算後，進行畫面渲染和本地存儲
function submitCalculation() {
    let weight = weightField.value;
    let height = heightField.value;
    let blankWarns = document.querySelectorAll('.blankWarn');

    blankWarns.forEach((blankWarn) => blankWarn.remove());

    if (!!weight && !!height) {
        let dateNow = new Date();
        let dateNowFormat = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
        let storageObj = {
            date: dateNowFormat,
            weight: weight,
            height: height,
        }
        let countBMIStatus = countBMI(storageObj);

        resultCircle.innerHTML = `
                <div class="resultBlock">
                    <div>${storageObj.bmi}</div>
                    BMI
                </div>
                    <button id="restartButton">
                        <img src="./img/icons_loop.png" alt="">
                    </button>
                <div class="statusInCircle">${storageObj.status}</div>`;

        submitButton.style.display = 'none';
        resultCircle.style.display = 'flex';
        resultCircle.style.borderColor = bmiStatusColors[countBMIStatus].color;
        document.querySelector('#restartButton').style.background = bmiStatusColors[countBMIStatus].color;
        document.querySelector('.statusInCircle').style.color = bmiStatusColors[countBMIStatus].color;
        document.addEventListener('click', function (e) {
            if (e.target.id == 'restartButton' || e.target.parentNode.nodeName == 'BUTTON') {
                resultCircle.style.display = 'none';
                submitButton.style.display = 'block';

            }
        });

        storageArr.push(storageObj);
        localStorage.setItem('storageData', JSON.stringify(storageArr));

        document.querySelector('#heightField').value = '';
        document.querySelector('#weightField').value = '';

        updateResultsList();

    } else {
        let weightTtile = document.querySelector('#weightTtile');
        let heightTtile = document.querySelector('#heightTtile');

        if (!weight && !height) {
            weightTtile.insertAdjacentHTML(`afterend`, `<h4 class="blankWarn"><div>▼</div>&nbsp請輸入體重！</h4>`);
            heightTtile.insertAdjacentHTML(`afterend`, `<h4 class="blankWarn"><div>▼</div>&nbsp請輸入身高！</h4>`);
        } else if (!height) {
            heightTtile.insertAdjacentHTML(`afterend`, `<h4 class="blankWarn"><div>▼</div>&nbsp請輸入身高！</h4>`);
        } else if (!weight) {
            weightTtile.insertAdjacentHTML(`afterend`, `<h4 class="blankWarn"><div>▼</div>&nbsp請輸入體重！</h4>`);
        }
    }

}

// 函式：BMI計算
function countBMI(countCase) {
    let bmi = (countCase.weight / Math.pow((countCase.height / 100), 2)).toFixed(2);

    switch (!!bmi) {

        case (bmi < 18.5):
            countCase['bmi'] = bmi;
            countCase['status'] = '過輕';
            return 'underWeight';
        case (bmi >= 18.5 && bmi < 24):
            countCase['bmi'] = bmi;
            countCase['status'] = '理想';
            return 'normalRange';
        case (bmi >= 24 && bmi < 27):
            countCase['bmi'] = bmi;
            countCase['status'] = '過重';
            return 'obeseLevel01';
        case (bmi >= 27 && bmi < 30):
            countCase['bmi'] = bmi;
            countCase['status'] = '輕度肥胖';
            return 'obeseLevel02';
        case (bmi >= 30 && bmi < 35):
            countCase['bmi'] = bmi;
            countCase['status'] = '中度肥胖';
            return 'obeseLevel03';
        case (bmi > 35):
            countCase['bmi'] = bmi;
            countCase['status'] = '重度肥胖';
            return 'obeseLevel04';
        default:
            return 'Error';
    }
}

// 函式：更新紀錄列表
function updateResultsList() {
    let ResultsList = '';

    for (let i = 0; i < storageArr.length; i++) {
        ResultsList += `
            <li data-index="${i}" class="resultRow">
                <div class="statusInRow">
                    ${storageArr[i].status}
                </div>
                <div class="dataBlock">
                    <div class="dataItem">
                        <div class="dataTitle">BMI</div>${storageArr[i].bmi}
                    </div>
                    <div class="dataItem">
                        <div class="dataTitle">weight</div>${storageArr[i].weight}
                    </div>
                    <div class="dataItem">
                        <div class="dataTitle">height</div>${storageArr[i].height}
                    </div>
                </div>
                <div id="dateBlock">
                    ${storageArr[i].date}
                </div>
                <a href="#">刪除本列</a>
            </li>`
    }

    bmiResultsList.innerHTML = ResultsList;

    if (storageArr.length == 0) {
        deleteAllButton.setAttribute('disabled', 'disabled');
        deleteAllButton.style.cursor = 'not-allowed';
        deleteAllButton.textContent = '暫無資料';
    } else {
        deleteAllButton.removeAttribute('disabled');
        deleteAllButton.style.cursor = 'pointer';
        deleteAllButton.textContent = '全部清空';
    }
}

// 函式：刪除單一紀錄
function deleteSingleRow(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') { return; }

    let listItem = e.target.closest('li.resultRow');
    let selectedIndex = listItem.dataset.index;
    storageArr.splice(selectedIndex, 1);

    localStorage.setItem('storageData', JSON.stringify(storageArr));
    updateResultsList();
}

// 函式：刪除全部記錄
function deleteWholeList() {
    storageArr = [];
    localStorage.removeItem('storageData');
    updateResultsList();
}
