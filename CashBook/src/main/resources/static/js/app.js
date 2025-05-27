// 전역 변수
let transactions = [];
let categories = [];

// API 베이스 URL
const API_BASE = '/transactions';
const CATEGORY_API = '/categories';

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();         // 섹션 초기 상태 설정
    setupEventListeners();   // 버튼 이벤트 연결
    loadData();              // 카테고리 + 거래내역 로드
});

// 앱 초기화
function initializeApp() {
    showSection('homeSection');
    createTransactionForm();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 홈 버튼
    document.getElementById('homeBtn').addEventListener('click', () => {
        showSection('homeSection');
        loadTransactions();
    });

    // 거래 추가 버튼
    document.getElementById('addBtn').addEventListener('click', () => {
        showSection('addSection');
        createTransactionForm('add');  // ✅ 폼 초기화 추가
    });

    // 통계 버튼
    document.getElementById('statsBtn').addEventListener('click', () => {
        showSection('statsSection');
        loadStatistics();
    });
}


// 섹션 전환
function showSection(sectionId) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 모든 네비게이션 버튼 비활성화
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 섹션 보이기
    document.getElementById(sectionId).classList.add('active');
    
    // 해당 버튼 활성화
    if (sectionId === 'homeSection') {
        document.getElementById('homeBtn').classList.add('active');
    } else if (sectionId === 'addSection') {
        document.getElementById('addBtn').classList.add('active');
    } else if (sectionId === 'statsSection') {
        document.getElementById('statsBtn').classList.add('active');
    }
}

// 거래 추가 폼 생성
function createTransactionForm(mode = 'add', transaction = null) {
    const form = document.getElementById('transactionForm');
    form.innerHTML = '';  // 기존 내용 비움

    // 필드 및 버튼을 묶을 div 생성
    const formFields = document.createElement('div');
    formFields.innerHTML = `
        <div class="form-group">
            <label for="itemName">항목명</label>
            <input type="text" id="itemName" name="itemName" required>
        </div>
        <div class="form-group">
            <label for="amount">금액</label>
            <input type="number" id="amount" name="amount" required>
        </div>
        <div class="form-group">
            <label for="type">유형</label>
            <select id="type" name="type" required>
                <option value="">선택해주세요</option>
                <option value="수입">수입</option>
                <option value="지출">지출</option>
            </select>
        </div>
        <div class="form-group">
            <label for="categoryId">카테고리</label>
            <select id="categoryId" name="categoryId" required>
                <option value="">카테고리를 선택해주세요</option>
            </select>
        </div>
        <div class="form-group">
            <label for="transactionDate">날짜</label>
            <input type="date" id="transactionDate" name="transactionDate" required>
        </div>
        <div class="form-group">
            <label for="memo">메모</label>
            <textarea id="memo" name="memo" rows="3" placeholder="메모를 입력하세요 (선택사항)"></textarea>
        </div>
        <div id="transactionFormButtons" class="form-buttons"></div>
    `;

    // form 안에 내용 삽입
    form.appendChild(formFields);

    // 오늘 날짜 기본값
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];

    // 카테고리 옵션 로드
    updateCategoryOptions();

    // 수정 모드일 경우 기존 값 세팅
    if (mode === 'edit' && transaction) {
        document.getElementById('itemName').value = transaction.itemName;
        document.getElementById('amount').value = transaction.amount;
        document.getElementById('type').value = transaction.type;
        document.getElementById('categoryId').value = transaction.categoryId;
        document.getElementById('transactionDate').value = transaction.transactionDate.split('T')[0];
        document.getElementById('memo').value = transaction.memo || '';
    }

    // 버튼 삽입
    const buttonArea = document.getElementById('transactionFormButtons');
    if (mode === 'edit' && transaction) {
        buttonArea.innerHTML = `
            <button type="button" class="btn" onclick="submitEdit(${transaction.id})">💾 수정</button>
            <button type="button" class="btn" onclick="submitDelete(${transaction.id})">🗑 삭제</button>
        `;
    } else {
        buttonArea.innerHTML = `
            <button type="submit" class="btn">💰 거래 추가</button>
        `;
        form.addEventListener('submit', handleFormSubmit);  // 추가 모드만 submit 이벤트 연결
    }
}


// 데이터 로드
async function loadData() {
    await loadCategories();
    await loadTransactions();
}

// 카테고리 로드
async function loadCategories() {
    try {
        const response = await fetch(CATEGORY_API); // /categoried API 호출
        categories = await response.json();
        updateCategoryOptions();
    } catch (error) {
        console.error('카테고리 로드 실패:', error);
        showNotification('카테고리를 불러오는데 실패했습니다.', 'error');
    }
}

// 카테고리 옵션 업데이트
function updateCategoryOptions() {
    const categorySelect = document.getElementById('categoryId');
    if (categorySelect) {
        // 기존 옵션 제거 (첫 번째 옵션 제외)
        while (categorySelect.children.length > 1) {
            categorySelect.removeChild(categorySelect.lastChild);
        }
        
        // 새 옵션 추가
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }
}

// 거래 내역 로드
async function loadTransactions() {
    try {
        const response = await fetch(API_BASE);  // /transactions API 호출
        transactions = await response.json();
        displayTransactions();
    } catch (error) {
        console.error('거래 내역 로드 실패:', error);
        showNotification('거래 내역을 불러오는데 실패했습니다.', 'error');
    }
}

// 거래 내역 표시
function displayTransactions() {
    const container = document.getElementById('transactionList');

    if (transactions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6c757d;">
                <h3>😊 아직 거래 내역이 없습니다</h3>
                <p>첫 번째 거래를 추가해보세요!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = transactions.map(transaction => {
        const categoryName = getCategoryName(transaction.categoryId);
        const typeClass = transaction.type === '수입' ? 'income' : 'expense';
        const sign = transaction.type === '수입' ? '+' : '-';
        const dateOnly = transaction.transactionDate.split('T')[0];

        return `
            <div class="transaction-item ${typeClass}" onclick="editTransaction(${transaction.id})" style="cursor: pointer;">
                <div class="transaction-header">
                    <span class="transaction-title">${transaction.itemName}</span>
                    <span class="transaction-amount ${typeClass}">
                        ${sign}${Number(transaction.amount).toLocaleString()}원
                    </span>
                </div>
                <div class="transaction-details">
                    📅 ${dateOnly} | 📁 ${categoryName} | 💭 ${transaction.memo || '메모 없음'}
                </div>
            </div>
        `;
    }).join('');
}


function editTransaction(id) {
    fetch(`${API_BASE}/${id}`)
        .then(res => {
            console.log('응답 상태:', res.status);
            return res.json();
        })
        .then(data => {
            console.log('불러온 거래:', data);
            showSection('addSection');
            createTransactionForm('edit', data);
        })
        .catch(err => {
            console.error('거래 불러오기 실패:', err);
            showNotification('거래 정보를 불러오지 못했습니다.', 'error');
        });
}



// 카테고리 이름 가져오기
function getCategoryName(categoryId) {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.name : '미분류';
}

// 폼 제출 처리
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const transactionData = {
        itemName: formData.get('itemName'),
        amount: parseInt(formData.get('amount')),
        type: formData.get('type'),
        categoryId: parseInt(formData.get('categoryId')),
        transactionDate: formData.get('transactionDate'),
        memo: formData.get('memo') || ''
    };
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });
        
        if (response.ok) {
            showNotification('거래가 성공적으로 추가되었습니다! 🎉', 'success');
            event.target.reset();
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
            await loadTransactions();
        } else {
            throw new Error('서버 오류');
        }
    } catch (error) {
        console.error('거래 추가 실패:', error);
        showNotification('거래 추가에 실패했습니다. 😞', 'error');
    }
}

async function submitEdit(id) {
    const updatedData = {
        itemName: document.getElementById('itemName').value,
        amount: parseInt(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        categoryId: parseInt(document.getElementById('categoryId').value),
        transactionDate: document.getElementById('transactionDate').value,
        memo: document.getElementById('memo').value || ''
    };

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (res.ok) {
            showNotification('거래 수정 완료! ✅', 'success');
            loadTransactions();
            showSection('homeSection');
        } else {
            throw new Error();
        }
    } catch {
        showNotification('수정 실패 😢', 'error');
    }
}


async function submitDelete(id) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            showNotification('거래 삭제 완료 🗑', 'success');
            loadTransactions();
            showSection('homeSection');
        } else throw new Error();
    } catch {
        showNotification('삭제 실패 😢', 'error');
    }
}


// 통계 로드
async function loadStatistics() {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM 형식
    
    try {
        // 월별 요약 통계
        const summaryResponse = await fetch(`${API_BASE}/summary/monthly?month=${currentMonth}`);
        const summaryData = await summaryResponse.json();
        
        // 카테고리별 통계
        const categoryResponse = await fetch(`${API_BASE}/summary/category`);
        const categoryData = await categoryResponse.json();
        
        displayStatistics(summaryData, categoryData);
    } catch (error) {
        console.error('통계 로드 실패:', error);
        showNotification('통계를 불러오는데 실패했습니다.', 'error');
    }
}

// 통계 표시
function displayStatistics(summary, categoryStats) {
    const container = document.getElementById('statisticsContent');

    const income = summary.income || 0;
    const expense = summary.expense || 0;
    const balance = income - expense;

    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div class="stat-card" style="background: #51cf66; color: white; padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3>💰 이번 달 수입</h3>
                <p style="font-size: 1.5rem; font-weight: bold;">+${income.toLocaleString()}원</p>
            </div>
            <div class="stat-card" style="background: #ff6b6b; color: white; padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3>💸 이번 달 지출</h3>
                <p style="font-size: 1.5rem; font-weight: bold;">-${expense.toLocaleString()}원</p>
            </div>
            <div class="stat-card" style="background: #4facfe; color: white; padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3>📊 잔액</h3>
                <p style="font-size: 1.5rem; font-weight: bold;">${balance >= 0 ? '+' : ''}${balance.toLocaleString()}원</p>
            </div>
        </div>

        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px;">
            <h3 style="margin-bottom: 1rem; color: #495057;">📈 카테고리별 통계</h3>
            ${categoryStats && categoryStats.length > 0 ? 
                categoryStats.map(stat => {
                    const categoryId = stat.categoryId || stat.CATEGORYID;
                    const categoryName = getCategoryName(categoryId);
                    const totalAmount = Number(stat.totalAmount || stat.TOTALAMOUNT) || 0;
                    const transactionCount = Number(stat.transactionCount || stat.TRANSACTIONCOUNT) || 0;
                    const type = stat.type || stat.TYPE || '미분류';

                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: white; margin-bottom: 0.5rem; border-radius: 8px; border-left: 4px solid ${type === '수입' ? '#51cf66' : '#ff6b6b'};">
                            <span>${categoryName} (${type})</span>
                            <strong style="color: ${type === '수입' ? '#51cf66' : '#ff6b6b'};">
                                ${totalAmount.toLocaleString()}원 (${transactionCount}건)
                            </strong>
                        </div>
                    `;
                }).join('')
                : '<p style="text-align: center; color: #6c757d;">통계 데이터가 없습니다.</p>'
            }
        </div>
    `;
}


// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#51cf66' : type === 'error' ? '#ff6b6b' : '#4facfe'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // 애니메이션 CSS 추가
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.remove();
    }, 3000);
}