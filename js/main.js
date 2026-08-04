/* =========================================================
   MARMORARIA CENTRAL | main.js
   ========================================================= */
(function () {
  'use strict';

  /* Rede de seguranca: se qualquer coisa aqui falhar, o conteudo continua visivel */
  var revelarTudo = function () {
    document.querySelectorAll('.anim, .galeria__item').forEach(function (el) { el.classList.add('visivel'); });
  };
  window.addEventListener('error', revelarTudo);
  setTimeout(revelarTudo, 2500);

  try {

  var WHATS = '554197980740';
  /* TROCAR pelo endpoint real do Google Apps Script (Implantar > App da Web) */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyGWoWw6Ck7kjpsbvSu2rEE52l-1N9YX4p7gPDePnIu-chUrRwrhLHDRsUtUG-iTMnV/exec';

  var dl = function (evento, dados) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: evento }, dados || {}));
  };

  /* ---------- Ano do rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Header ao rolar ---------- */
  var topo = document.getElementById('topo');
  var aoRolar = function () {
    if (window.scrollY > 60) topo.classList.add('rolado');
    else topo.classList.remove('rolado');
  };
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* ---------- Menu mobile ---------- */
  var abre = document.querySelector('.abre-menu');
  var menu = document.getElementById('menu-mobile');
  var fecha = document.querySelector('.fecha-menu');

  function abrirMenu(estado) {
    menu.classList.toggle('aberto', estado);
    menu.setAttribute('aria-hidden', String(!estado));
    abre.setAttribute('aria-expanded', String(estado));
    document.body.style.overflow = estado ? 'hidden' : '';
    if (estado) menu.querySelector('a').focus();
    else abre.focus();
  }
  if (abre) abre.addEventListener('click', function () { abrirMenu(true); });
  if (fecha) fecha.addEventListener('click', function () { abrirMenu(false); });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { abrirMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) abrirMenu(false);
  });

  /* ---------- Animação de scroll ---------- */
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alvos = document.querySelectorAll('.anim');
  if (reduzir || !('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visivel'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Barra de progresso de leitura ---------- */
  if (!reduzir) {
    var barra = document.createElement('div');
    barra.className = 'progresso';
    document.body.appendChild(barra);
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      barra.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ---------- Parallax suave no hero ---------- */
  var fundo = document.querySelector('[data-parallax] img');
  var heroTxt = document.querySelector('[data-hero]');
  if (fundo && !reduzir) {
    var ticking = false;
    var mover = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        fundo.style.transform = 'translate3d(0,' + (y * 0.28) + 'px,0) scale(1.08)';
        if (heroTxt) {
          heroTxt.style.transform = 'translate3d(0,' + (y * 0.12) + 'px,0)';
          heroTxt.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.75)));
        }
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(mover); }
    }, { passive: true });
    mover();
  }

  /* ---------- Revelacao escalonada da galeria ---------- */
  var galeria = document.querySelector('[data-stagger]');
  if (galeria && !reduzir && 'IntersectionObserver' in window) {
    var obsG = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var visiveisAgora = Array.prototype.filter.call(
          galeria.children, function (c) { return !c.classList.contains('oculto'); });
        var pos = visiveisAgora.indexOf(en.target);
        en.target.style.transitionDelay = ((pos % 8) * 0.07) + 's';
        en.target.classList.add('visivel');
        obsG.unobserve(en.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(galeria.children, function (c) { obsG.observe(c); });
  } else if (galeria) {
    Array.prototype.forEach.call(galeria.children, function (c) { c.classList.add('visivel'); });
  }

  /* ---------- Contadores da barra de credibilidade ---------- */
  var contadores = document.querySelectorAll('[data-conta]');
  var animarNumero = function (el) {
    var alvo = parseInt(el.getAttribute('data-conta'), 10);
    var sufixo = el.getAttribute('data-sufixo') || '';
    if (reduzir) { el.textContent = alvo + sufixo; return; }
    var inicio = null, dur = 1400;
    var passo = function (t) {
      if (!inicio) inicio = t;
      var p = Math.min((t - inicio) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(alvo * eased) + (p === 1 ? sufixo : '');
      if (p < 1) window.requestAnimationFrame(passo);
    };
    window.requestAnimationFrame(passo);
  };
  if ('IntersectionObserver' in window) {
    var obsN = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { animarNumero(en.target); obsN.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    contadores.forEach(function (el) { obsN.observe(el); });
  } else {
    contadores.forEach(animarNumero);
  }

  /* ---------- Eventos de WhatsApp ---------- */
  document.querySelectorAll('[data-zap]').forEach(function (el) {
    el.addEventListener('click', function () {
      dl('clique_whatsapp', { origem: el.getAttribute('data-zap') });
    });
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq__botao').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var aberto = btn.getAttribute('aria-expanded') === 'true';
      var painel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!aberto));
      painel.classList.toggle('aberta', !aberto);
    });
  });

  /* ---------- Filtro do portfólio ---------- */
  var itens = Array.prototype.slice.call(document.querySelectorAll('.galeria__item'));
  document.querySelectorAll('.filtro').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filtro');
      document.querySelectorAll('.filtro').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      itens.forEach(function (it) {
        it.classList.toggle('oculto', cat !== 'todos' && it.getAttribute('data-cat') !== cat);
        if (!it.classList.contains('oculto')) { it.style.transitionDelay = '0s'; it.classList.add('visivel'); }
      });
      visiveis();
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbLeg = document.getElementById('lb-legenda');
  var lista = itens;
  var atual = 0;
  var origem = null;

  function visiveis() {
    lista = itens.filter(function (i) { return !i.classList.contains('oculto'); });
  }
  visiveis();

  function mostrar(i) {
    if (i < 0) i = lista.length - 1;
    if (i >= lista.length) i = 0;
    atual = i;
    var img = lista[i].querySelector('img');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.getAttribute('alt');
    lbLeg.textContent = img.getAttribute('alt');
  }
  function abrirLb(i) {
    origem = document.activeElement;
    visiveis();
    mostrar(i);
    lb.classList.add('ativo');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-fechar').focus();
  }
  function fecharLb() {
    lb.classList.remove('ativo');
    document.body.style.overflow = '';
    lbImg.src = '';
    if (origem) origem.focus();
  }
  itens.forEach(function (it) {
    it.addEventListener('click', function () {
      visiveis();
      abrirLb(lista.indexOf(it));
    });
  });
  lb.querySelector('.lb-fechar').addEventListener('click', fecharLb);
  lb.querySelector('.lb-ant').addEventListener('click', function () { mostrar(atual - 1); });
  lb.querySelector('.lb-prox').addEventListener('click', function () { mostrar(atual + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) fecharLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('ativo')) return;
    if (e.key === 'Escape') fecharLb();
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
    if (e.key === 'Tab') {
      var foco = lb.querySelectorAll('button');
      var primeiro = foco[0], ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    }
  });

  /* ---------- Formulário ---------- */
  var form = document.getElementById('form-orcamento');
  var enviar = document.getElementById('enviar');
  var status = document.getElementById('status-form');
  var zap = document.getElementById('whatsapp');

  zap.addEventListener('input', function () {
    var v = zap.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 3) + ' ' + v.slice(3, 7) + ' ' + v.slice(7);
    else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    else if (v.length > 0) v = '(' + v;
    zap.value = v;
    validar();
  });

  var obrigatorios = Array.prototype.slice.call(form.querySelectorAll('[required]'));

  function campoValido(c) {
    if (c === zap) return c.value.replace(/\D/g, '').length >= 10;
    return c.value.trim().length >= (c.tagName === 'SELECT' ? 1 : 3);
  }
  function validar() {
    var ok = obrigatorios.every(campoValido);
    enviar.disabled = !ok;
    return ok;
  }
  obrigatorios.forEach(function (c) {
    c.addEventListener('input', validar);
    c.addEventListener('change', validar);
    c.addEventListener('blur', function () {
      var alvo = document.getElementById('e-' + c.id);
      if (!campoValido(c)) {
        c.setAttribute('aria-invalid', 'true');
        if (alvo) alvo.textContent = c === zap ? 'Informe um WhatsApp válido com DDD.' : 'Campo obrigatório.';
      } else {
        c.removeAttribute('aria-invalid');
        if (alvo) alvo.textContent = '';
      }
    });
  });
  validar();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validar()) return;

    var dados = {};
    new FormData(form).forEach(function (v, k) { dados[k] = v; });
    dados.origem = 'Landing Page Google Ads';
    dados.data = new Date().toLocaleString('pt-BR');

    enviar.disabled = true;
    status.textContent = 'Enviando seus dados, aguarde.';
    dl('envio_formulario', { material: dados.material, ambiente: dados.ambiente });

    var texto = 'Olá, vim do Google e acabei de preencher o formulário no site.'
      + ' Nome: ' + dados.nome
      + ' | Cidade: ' + dados.cidade
      + ' | Projeto: ' + dados.tipo
      + ' | Ambiente: ' + dados.ambiente
      + ' | Material: ' + dados.material;

    var irParaZap = function () {
      status.textContent = 'Recebemos seus dados. Abrindo o WhatsApp.';
      window.location.href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(texto);
    };

    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dados)
    }).then(irParaZap).catch(irParaZap);

    setTimeout(irParaZap, 3500);
  });

  } catch (err) {
    revelarTudo();
    if (window.console) console.error('LP Marmoraria Central:', err);
  }
})();
