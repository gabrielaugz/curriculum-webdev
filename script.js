document.addEventListener('DOMContentLoaded', () => {
  // Tema claro/escuro com localStorage
  const themeSwitch = document.getElementById('theme-switch');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeSwitch.checked = true;
  }
  themeSwitch.addEventListener('change', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Back-to-top
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 300);
  });
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Chart.js – gráfico de barras horizontal
  const ctx = document.getElementById('skills-chart')?.getContext('2d');
  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Java', 'Python', 'C++', 'HTML/CSS/JS', 'MySQL', 'Git'],
        datasets: [{ label: 'Nível (%)', data: [80, 70, 60, 90, 75, 85] }]
      },
      options: {
        indexAxis: 'y',
        scales: { x: { beginAtZero: true, max: 100 } },
        plugins: { legend: { display: false } }
      }
    });
  }

  // Filtrar habilidades
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.skill-list__item').forEach(li => {
        li.classList.toggle('hidden', filter !== 'all' && li.dataset.category !== filter);
      });
    });
  });

  // Download do currículo em PDF
  document.getElementById('download-pdf').addEventListener('click', () => {
    const el = document.querySelector('main.curriculum');
    html2pdf().set({
      margin: 0.5,
      filename: 'Curriculo_Gabriel_Augusto.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(el).save();
  });

  // Formulário de contato
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim()
    };
    if (!data.name || !data.email || !data.message) {
      status.textContent = 'Preencha todos os campos!';
      status.style.color = 'red';
      return;
    }
    status.textContent = 'Enviando…';
    status.style.color = '';

    try {
      const resp = await fetch('https://formspree.io/f/FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (resp.ok) {
        status.textContent = 'Mensagem enviada com sucesso!';
        status.style.color = 'green';
        form.reset();
      } else {
        throw new Error('Resposta não OK');
      }
    } catch {
      status.textContent = 'Falha ao enviar. Tente novamente.';
      status.style.color = 'red';
    }
  });
});
