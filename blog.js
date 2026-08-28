const STATE = {
    posts: [],
    categoriaAtiva: 'Todas',
    termoBusca: ''
};

const grid = document.getElementById('blogGrid');
const filtrosContainer = document.getElementById('blogFiltros');
const searchInput = document.getElementById('blogSearch');
const noResults = document.getElementById('blogNoResults');

const modalOverlay = document.getElementById('blogModalOverlay');
const modalClose = document.getElementById('blogModalClose');
const modalImg = document.getElementById('blogModalImg');
const modalCategoria = document.getElementById('blogModalCategoria');
const modalTitulo = document.getElementById('blogModalTitulo');
const modalData = document.getElementById('blogModalData');
const modalConteudo = document.getElementById('blogModalConteudo');

function init() {
    fetch('data/posts.json')
        .then(res => res.json())
        .then(posts => {
            STATE.posts = posts.sort((a, b) => new Date(b.data) - new Date(a.data));
            renderFiltros();
            renderGrid();
        })
        .catch(err => console.error('Erro ao carregar posts.json:', err));
}

function formatarData(dataStr) {
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function textoConteudo(post) {
    return post.conteudo
        .map(bloco => bloco.tipo === 'lista' ? bloco.itens.join(' ') : (bloco.texto || ''))
        .join(' ')
        .replace(/<[^>]+>/g, '');
}

function filtrarPosts() {
    const termo = normalizarTexto(STATE.termoBusca.trim());
    return STATE.posts.filter(post => {
        const categoriaOk = STATE.categoriaAtiva === 'Todas' || post.categoria === STATE.categoriaAtiva;
        if (!categoriaOk) return false;
        if (!termo) return true;

        const alvo = normalizarTexto(`${post.titulo} ${post.resumo} ${post.categoria} ${textoConteudo(post)}`);
        const palavras = termo.split(/\s+/).filter(Boolean);

        return palavras.every(palavra => alvo.includes(palavra));
    });
}

function renderFiltros() {
    const categorias = ['Todas', ...new Set(STATE.posts.map(p => p.categoria))];
    filtrosContainer.innerHTML = '';
    categorias.forEach(categoria => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'blog-filtro-btn' + (categoria === STATE.categoriaAtiva ? ' active' : '');
        btn.textContent = categoria;
        btn.addEventListener('click', () => {
            STATE.categoriaAtiva = categoria;
            document.querySelectorAll('.blog-filtro-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrid();
        });
        filtrosContainer.appendChild(btn);
    });
}

function renderGrid() {
    const posts = filtrarPosts();
    grid.innerHTML = '';

    if (posts.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    noResults.style.display = 'none';

    posts.forEach(post => {
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.innerHTML = `
            <div class="blog-card-img-wrap">
                <img src="${post.imagem}" alt="${post.titulo}" loading="lazy">
            </div>
            <div class="blog-card-body">
                <span class="blog-card-categoria">${post.categoria}</span>
                <h3 class="blog-card-titulo">${post.titulo}</h3>
                <p class="blog-card-resumo">${post.resumo}</p>
                <span class="blog-card-data">${formatarData(post.data)}</span>
            </div>
        `;
        card.addEventListener('click', () => abrirModal(post.id));
        grid.appendChild(card);
    });
}

function renderConteudo(blocos) {
    return blocos.map(bloco => {
        switch (bloco.tipo) {
            case 'paragrafo':
                return `<p>${bloco.texto}</p>`;
            case 'subtitulo':
                return `<h3>${bloco.texto}</h3>`;
            case 'lista':
                return `<ul>${bloco.itens.map(item => `<li>${item}</li>`).join('')}</ul>`;
            case 'imagem':
                return `<figure><img src="${bloco.src}" alt="${bloco.legenda || ''}">${bloco.legenda ? `<figcaption>${bloco.legenda}</figcaption>` : ''}</figure>`;
            default:
                return '';
        }
    }).join('');
}

function abrirModal(id) {
    const post = STATE.posts.find(p => p.id === id);
    if (!post) return;

    modalImg.src = post.imagem;
    modalImg.alt = post.titulo;
    modalCategoria.textContent = post.categoria;
    modalTitulo.textContent = post.titulo;
    modalData.textContent = formatarData(post.data);
    modalConteudo.innerHTML = renderConteudo(post.conteudo);

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalOverlay.scrollTop = 0;
    document.getElementById('blogModal').scrollTop = 0;
}

function fecharModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', fecharModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) fecharModal();
});

searchInput.addEventListener('input', (e) => {
    STATE.termoBusca = e.target.value;
    renderGrid();
});

init();