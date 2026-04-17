
    (function() {
      // Grab DOM elements
      const galleryContainer = document.querySelector('.cshub-gallery');
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('modalImage');
      const closeBtn = document.getElementById('closeModalBtn');
      const modalCaption = document.getElementById('modalCaption');

      // Helper to open modal with specific image src and alt text
      function openModal(imgSrc, imgAlt) {
        if (!modal || !modalImg) return;
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt || 'CSHub Gallery Image';
        if (modalCaption) {
          modalCaption.textContent = imgAlt ? `✨ ${imgAlt} ✨` : '🌟 CSHub Gallery 🌟';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll behind modal
      }

      function closeModal() {
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
          // optional: reset image src after transition to avoid flicker
          setTimeout(() => {
            if (!modal.classList.contains('active') && modalImg) {
              // keep but fine
            }
          }, 200);
        }
      }

      // Attach click/tap listeners to each gallery item (images themselves or item wrapper)
      if (galleryContainer) {
        // Use event delegation for better performance & dynamic if needed
        galleryContainer.addEventListener('click', (e) => {
          // Find the actual image element or the gallery-item container
          let targetImg = e.target.closest('img');
          if (targetImg && targetImg.closest('.gallery-item')) {
            e.stopPropagation();
            const galleryItem = targetImg.closest('.gallery-item');
            // get high-res image source (data attribute or the src itself)
            let highResSrc = galleryItem.getAttribute('data-img-src');
            if (!highResSrc) {
              highResSrc = targetImg.getAttribute('src');
            }
            const altText = targetImg.getAttribute('alt') || galleryItem.getAttribute('data-img-alt') || 'CSHub Image';
            if (highResSrc) {
              openModal(highResSrc, altText);
            } else {
              openModal(targetImg.src, altText);
            }
          }
        });
      }

      // Close modal when clicking on the overlay background (modal itself)
      if (modal) {
        modal.addEventListener('click', (e) => {
          // if click is directly on modal background (not on modal-content or close btn)
          if (e.target === modal) {
            closeModal();
          }
        });
      }

      // Close button click
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          closeModal();
        });
      }

      // Keyboard support: ESC closes modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
          closeModal();
        }
      });

      // Optional: also allow horizontal drag-to-scroll without interfering with modal
      const gallery = document.querySelector('.cshub-gallery');
      if (gallery) {
        let isDown = false;
        let startX;
        let scrollLeft;

        gallery.addEventListener('mousedown', (e) => {
          // avoid conflict if clicking on image: we only start drag if not on img? but fine
          if (e.target.closest('img')) return; // if user intends to tap, dragging not initiated on img mousedown? still acceptable.
          isDown = true;
          gallery.style.cursor = 'grabbing';
          startX = e.pageX - gallery.offsetLeft;
          scrollLeft = gallery.scrollLeft;
        });

        gallery.addEventListener('mouseleave', () => {
          isDown = false;
          gallery.style.cursor = 'grab';
        });

        gallery.addEventListener('mouseup', () => {
          isDown = false;
          gallery.style.cursor = 'grab';
        });

        gallery.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - gallery.offsetLeft;
          const walk = (x - startX) * 1.2;
          gallery.scrollLeft = scrollLeft - walk;
        });

        gallery.addEventListener('wheel', (e) => {
          if (e.target.closest('.cshub-gallery')) {
            e.preventDefault();
            gallery.scrollLeft += e.deltaY;
          }
        }, { passive: false });

        gallery.style.cursor = 'grab';
      }

      // Prevent modal content click from closing (propagation already handled)
      const modalContentDiv = document.querySelector('.modal-content');
      if (modalContentDiv) {
        modalContentDiv.addEventListener('click', (e) => e.stopPropagation());
      }
    })();
