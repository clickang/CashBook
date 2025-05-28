/**
 * 
 */

function showForm(type) {
    const container = document.getElementById('formContainer');

    let formHtml = `
        <form method="post" action="${type === 'login' ? '/login' : '/register'}" class="form">
            <h2>${type === 'login' ? '로그인' : '회원가입'}</h2>
    `;

    if (type === 'register') {
        formHtml += `
            <div class="form-group">
                <label for="username">이름</label>
                <input type="text" name="username" required />
            </div>
            <div class="form-group">
                <label for="email">이메일</label>
                <input type="email" name="email" required />
            </div>
        `;
    }

    formHtml += `
        <div class="form-group">
            <label for="loginId">아이디</label>
            <input type="text" name="loginId" required />
        </div>
        <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" name="password" required />
        </div>
        <div class="form-buttons">
            <button type="submit" class="btn">${type === 'login' ? '로그인' : '회원가입'}</button>
        </div>
        </form>
    `;

    container.innerHTML = formHtml;
}

async function login(event) {
    event.preventDefault();
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `loginId=${encodeURIComponent(loginId)}&password=${encodeURIComponent(password)}`
    });
    // 서버에서 redirect 처리됨
}

async function register(event) {
    event.preventDefault();
    // username, email 등 수집해서 /register로 POST
}


