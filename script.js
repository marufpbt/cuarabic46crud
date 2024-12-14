document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userCardsContainer = document.getElementById('userCards');
    const registrationButton = document.getElementById('registrationButton');
    const addUserButton = document.getElementById('addUserButton');
    const searchButton = document.getElementById('searchButton');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const searchSubmitButton = document.getElementById('searchSubmitButton');
    const registrationForm = document.getElementById('registrationForm');
    let users = [];
    let uploadedImageUrl = null;
    let isFormVisible = false; // Track form visibility state
  
    // Toggle the visibility of the registration form
    registrationButton.addEventListener('click', () => {
      if (isFormVisible) {
        registrationForm.classList.add('hidden');
      } else {
        registrationForm.classList.remove('hidden');
        searchContainer.classList.add('hidden');  // Hide search when form is visible
      }
      isFormVisible = !isFormVisible; // Toggle visibility state
    });
  
    // Toggle the visibility of the search form
    searchButton.addEventListener('click', () => {
      searchContainer.classList.toggle('hidden');
      registrationForm.classList.add('hidden');  // Hide form when search is visible
      isFormVisible = false; // Reset form visibility state
    });
  
    // Handle form submission to add user
    addUserButton.addEventListener('click', async () => {
      const avatarFile = document.getElementById('avatar').files[0];
      const name = document.getElementById('name').value;
      const number = document.getElementById('number').value;
      const jobTitle = document.getElementById('jobTitle').value;
      const company = document.getElementById('company').value;
      const district = document.getElementById('district').value;
      const thana = document.getElementById('thana').value;
  
      if (!avatarFile) {
        alert('Please select an image.');
        return;
      }
  
      // Prevent duplicate submissions if image upload is still in progress
      if (uploadedImageUrl === null) {
        const formData = new FormData();
        formData.append('image', avatarFile);
  
        try {
          const response = await fetch('https://api.imgbb.com/1/upload?key=867e70f288682920eb5ea080ee834a72', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
  
          if (data.success) {
            uploadedImageUrl = data.data.url;
            const newUser = {
              avatar: uploadedImageUrl,
              name,
              number,
              jobTitle,
              company,
              district,
              thana
            };
            users.push(newUser);
            renderUserCards();
            userForm.reset();
            uploadedImageUrl = null; // Reset the image URL after successful user creation
          } else {
            alert('Image upload failed!');
          }
        } catch (error) {
          alert('Something went wrong during the image upload.');
        }
      } else {
        alert('User has already been added with the uploaded image. Please upload a new image for a different user.');
      }
    });
  
    // Render user cards
    function renderUserCards() {
      userCardsContainer.innerHTML = ''; // Clear existing cards
      users.forEach((user, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${user.avatar}" alt="Avatar">
          <h3>${user.name}</h3>
          <p><strong>Number:</strong> ${user.number}</p>
          <p><strong>Job Title:</strong> ${user.jobTitle}</p>
          <p><strong>Company:</strong> ${user.company}</p>
          <p><strong>District:</strong> ${user.district}</p>
          <p><strong>Thana:</strong> ${user.thana}</p>
          <button onclick="deleteUser(${index})">Delete</button>
        `;
        userCardsContainer.appendChild(card);
      });
    }
  
    // Delete user
    window.deleteUser = (index) => {
      users.splice(index, 1);
      renderUserCards();
    };
  
    // Search users
    searchSubmitButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.jobTitle.toLowerCase().includes(searchTerm)
      );
      renderFilteredUsers(filteredUsers);
    });
  
    // Render filtered users
    function renderFilteredUsers(filteredUsers) {
      userCardsContainer.innerHTML = ''; // Clear existing cards
      filteredUsers.forEach((user, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${user.avatar}" alt="Avatar">
          <h3>${user.name}</h3>
          <p><strong>Number:</strong> ${user.number}</p>
          <p><strong>Job Title:</strong> ${user.jobTitle}</p>
          <p><strong>Company:</strong> ${user.company}</p>
          <p><strong>District:</strong> ${user.district}</p>
          <p><strong>Thana:</strong> ${user.thana}</p>
          <button onclick="deleteUser(${index})">Delete</button>
        `;
        userCardsContainer.appendChild(card);
      });
    }
  });
  