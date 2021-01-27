// 變數宣告
var submitButton = document.querySelector('#submitButton');
var resultCircle = document.querySelector('.resultCircle');
var heightField = document.querySelector('#heightField');
var weightField = document.querySelector('#weightField');
var bmiResultsList = document.querySelector('#bmiResultsList');
var deleteAllButton = document.querySelector('#deleteAllButton');
var storageArr = JSON.parse(localStorage.getItem('storageData')) || [];

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

// 函式：送出BMI計算
function submitCalculation() {

    let weight = weightField.value;
    let height = heightField.value;

    if (!!height && !!weight) {
        let status;
        let statusColor;
        let bmi = (weight / Math.pow((height / 100), 2)).toFixed(2);
        let dateNow = new Date();
        let dateNowFormat = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;

        switch (!!bmi) {
            case (bmi < 18.5):
                status = '過輕';
                statusColor = '#31BAF9';
                break;
            case (bmi >= 18.5 && bmi < 24):
                status = '理想';
                statusColor = '#86D73E';
                break;
            case (bmi >= 24 && bmi < 27):
                status = '過重';
                statusColor = '#FF982D';
                break;
            case (bmi >= 27 && bmi < 30):
                status = '輕度肥胖';
                statusColor = '#FF1200';
                break;
            case (bmi >= 30 && bmi < 35):
                status = '中度肥胖';
                statusColor = '#FF1200';
                break;
            case (bmi > 35):
                status = '重度肥胖';
                statusColor = '#FF1200';
                break;
        }

        resultCircle.innerHTML = `
                <div class="resultBlock">
                    <div>${bmi}</div>
                    BMI
                </div>
                    <button id="restartButton">
                        <img src="./img/icons_loop.png" alt="">
                    </button>
                <div class="statusInCircle">${status}</div>`;

        submitButton.style.display = 'none';
        resultCircle.style.display = 'flex';
        resultCircle.style.borderColor = statusColor;
        document.querySelector('#restartButton').style.background = statusColor;
        document.querySelector('.statusInCircle').style.color = statusColor;
        document.addEventListener('click', function (e) {
            if (e.target.id == 'restartButton' || e.target.parentNode.nodeName == 'BUTTON') {
                resultCircle.style.display = 'none';
                submitButton.style.display = 'block';

            }
        });

        let storageObj = {
            status: status,
            bmi: bmi,
            weight: weight,
            height: height,
            date: dateNowFormat
        }

        storageArr.push(storageObj);
        localStorage.setItem('storageData', JSON.stringify(storageArr));

        document.querySelector('#heightField').value = '';
        document.querySelector('#weightField').value = '';

        updateResultsList();

    } else {
        alert('請填寫完整或正確內容！')
    }

}

// 函式：更新紀錄列表
function updateResultsList() {
    let ResultsList = '';

    for (let i = 0; i < storageArr.length; i++) {
        ResultsList += `
            <li data-index="0" class="resultRow">
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

    let selectedIndex = e.target.dataset.index;
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
