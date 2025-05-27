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
	
	// 시작일: 3년 전, 종료일: 오늘
    const today = new Date();
    const past = new Date();
    past.setFullYear(today.getFullYear() - 3);

    document.getElementById('filterStartDate').value = past.toISOString().split('T')[0];
    document.getElementById('filterEndDate').value = today.toISOString().split('T')[0];
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 네비게이션 버튼
    document.getElementById('homeBtn').addEventListener('click', () => {
        showSection('homeSection');
        loadTransactions();
    });
    
    document.getElementById('addBtn').addEventListener('click', () => {
        showSection('addSection');
    });
    
    document.getElementById('statsBtn').addEventListener('click', () => {
        showSection('statsSection');
        loadStatistics();
    });
	
	// 날짜 필터 검색 버튼
	const filterBtn = document.getElementById('filterBtn');
	if (filterBtn) {
	    filterBtn.addEventListener('click', () => {
	        loadTransactions();
	    });
	}

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
function createTransactionForm() {
    const form = document.getElementById('transactionForm');
    form.innerHTML = `
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
        
        <button type="submit" class="btn">💰 거래 추가</button>
    `;
    
    // 오늘 날짜를 기본값으로 설정
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    
    // 폼 제출 이벤트
    form.addEventListener('submit', handleFormSubmit);
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
        const startInput = document.getElementById('filterStartDate');
        const endInput = document.getElementById('filterEndDate');

        let url = API_BASE;

        // 날짜가 선택된 경우 쿼리 파라미터 추가
        if (startInput && startInput.value && endInput && endInput.value) {
            url += `?startDate=${startInput.value}&endDate=${endInput.value}`;
        }

        const response = await fetch(url);
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
        
        // 날짜를 YYYY-MM-DD 형식으로 변환
        const dateOnly = transaction.transactionDate.split('T')[0];
        
        return `
            <div class="transaction-item ${typeClass}">
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
            <div class="stat-card" style="background: linear-gradient(135deg, #51cf66, #40c057); color: white; padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3>💰 이번 달 수입</h3>
                <p style="font-size: 1.5rem; font-weight: bold;">+${income.toLocaleString()}원</p>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #ff6b6b, #fa5252); color: white; padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3>💸 이번 달 지출</h3>
                <p style="font-size: 1.5rem; font-weight: bold;">-${expense.toLocaleString()}원</p>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 1.5rem; border-radius: 15px; text-align: center;">
                <h3>📊 잔액</h3>
                <p style="font-size: 1.5rem; font-weight: bold; color: ${balance >= 0 ? '#fff' : '#ffe066'};">
                    ${balance >= 0 ? '+' : ''}${balance.toLocaleString()}원
                </p>
            </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 15px;">
            <h3 style="margin-bottom: 1rem; color: #495057;">📈 카테고리별 통계</h3>
            ${categoryStats && categoryStats.length > 0 ? 
                categoryStats.map(stat => {
                    // 대문자로 접근
                    const categoryId = stat.CATEGORYID || stat.categoryId;
                    const categoryName = getCategoryName(categoryId) || `카테고리 ${categoryId}`;
                    const totalAmount = Number(stat.TOTALAMOUNT || stat.totalAmount) || 0;
                    const transactionCount = Number(stat.TRANSACTIONCOUNT || stat.transactionCount) || 0;
                    const type = stat.TYPE || stat.type || '미분류';
                    
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