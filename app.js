// Bino Group Taplink Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Office Working Hours Status
  const statusText = document.getElementById('statusText');
  const pulsingDot = document.querySelector('.pulsing-dot');

  function updateOfficeStatus() {
    // Current time in Tashkent (UTC+5)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tashkentTime = new Date(utcTime + (3600000 * 5));
    
    const day = tashkentTime.getDay(); // 0 is Sunday, 1 is Monday ...
    const hours = tashkentTime.getHours();
    const minutes = tashkentTime.getMinutes();
    const currentDecimalHour = hours + (minutes / 60);

    let isOpen = false;
    let schedule = "09:00 - 19:00";

    if (day >= 1 && day <= 6) {
      // Monday - Saturday: 09:00 - 19:00
      if (currentDecimalHour >= 9 && currentDecimalHour < 19) {
        isOpen = true;
      }
      schedule = "09:00 - 19:00";
    } else {
      // Sunday: 10:00 - 17:00
      if (currentDecimalHour >= 10 && currentDecimalHour < 17) {
        isOpen = true;
      }
      schedule = "10:00 - 17:00 (Yakshanba)";
    }

    if (statusText) {
      if (isOpen) {
        statusText.textContent = `Ofis ochiq • ${schedule}`;
        if (pulsingDot) pulsingDot.style.backgroundColor = '#10B981';
      } else {
        statusText.textContent = `Hozir dam olish vaqti • Ochilish: 09:00`;
        if (pulsingDot) pulsingDot.style.backgroundColor = '#F59E0B';
      }
    }
  }

  updateOfficeStatus();
  setInterval(updateOfficeStatus, 60000);

  // 2. Toast Notification Helper
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  // 3. Copy Phone Number
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const phoneNumber = '+998781225050';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(phoneNumber);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = phoneNumber;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast('Raqam nusxalandi: +998 (78) 122-50-50');
      } catch (err) {
        showToast('Nusxalandi: +998 (78) 122-50-50');
      }
    });
  }

  // 4. Share Action
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Bino Group — Rasmiy Sahifa',
        text: 'Bino Group — Zamonaviy ko\'chmas mulk va investitsiya loyihalari',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User dismissed or share failed
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Havola nusxalandi! Do\'stlaringizga yuboring');
        } catch (err) {
          showToast('Havola nusxalandi!');
        }
      }
    });
  }

  // 5. Consultation Modal Logic
  const consultModal = document.getElementById('consultModal');
  const openConsultModal = document.getElementById('openConsultModal');
  const closeConsultModal = document.getElementById('closeConsultModal');
  const consultForm = document.getElementById('consultForm');
  const clientName = document.getElementById('clientName');
  const clientPhone = document.getElementById('clientPhone');

  function openModal() {
    if (consultModal) {
      consultModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (clientName) clientName.focus();
    }
  }

  function closeModal() {
    if (consultModal) {
      consultModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openConsultModal) openConsultModal.addEventListener('click', openModal);
  if (closeConsultModal) closeConsultModal.addEventListener('click', closeModal);

  if (consultModal) {
    consultModal.addEventListener('click', (e) => {
      if (e.target === consultModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && consultModal && consultModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission -> Prepares Telegram direct message
  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = clientName ? clientName.value.trim() : '';
      const phone = clientPhone ? clientPhone.value.trim() : '';

      if (!name || !phone) return;

      const message = `Assalomu alaykum, Bino Group!%0AMen konsultatsiya olmoqchiman.%0A%0A👤 Ismim: ${encodeURIComponent(name)}%0A📞 Telefonim: ${encodeURIComponent(phone)}`;
      const tgUrl = `https://t.me/binogroup_admin?text=${message}`;

      showToast('Arizangiz qabul qilindi! Telegram ochilmoqda...');
      closeModal();

      setTimeout(() => {
        window.open(tgUrl, '_blank');
      }, 600);
    });
  }
});
