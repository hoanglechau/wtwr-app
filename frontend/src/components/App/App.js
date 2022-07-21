import React from 'react';
import './App.css';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import WeatherCards from '../WeatherCards/WeatherCards';
import CurrentTemperatureUnitContext from '../../contexts/CurrentTemperatureUnitContext';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import { determineTimeOfTheDay } from '../../utils/weatherCards';
import Navigation from '../Navigation/Navigation';
import Modal from '../Modal/Modal';
import ClothingCard from '../ClothingCard/ClothingCard';
import Login from '../Login';
import EditPasswordModal from '../EditPasswordModal/EditPasswordModal';
import EditProfileDataModal from '../EditProfileDataModal/EditProfileDataModal';
import Profile from '../Profile/Profile';

/**
 * The main React **App** component.
 */
const App = () => {
  // Replace the below state with specific Modal e.g. isCreateClothingModalOpen, setIsCreateClothingModalOpen
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({
    username: 'Practicum',
    avatar: '',
    email: 'practicum@email.com',
  });
  const [currentUserEmail, setCurrentUserEmail] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = React.useState('F');
  const [isEditProfileDataModalOpen, setIsEditProfileDataModalOpen] = React.useState(true);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = React.useState(false);

  const [userAvatar, setUserAvatar] = React.useState(false);
  // set "true" to simulate `isLoggedIn = true` look of the Navigation bar
  const [userName, setUserName] = React.useState(true);

  // not using state here, assuming the time only gets read every time user refreshes the page
  const currentHour = new Date().getHours();
  const timeOfTheDay = determineTimeOfTheDay(currentHour);

  const handleToggleSwitchChange = () => {
    currentTemperatureUnit === 'F'
      ? setCurrentTemperatureUnit('C')
      : setCurrentTemperatureUnit('F');
  };

  // Handle mouse click or Esc key down event
  //Check if all the other modals are open using || operator
  const isAnyPopupOpen = isLoginOpen || isEditProfileDataModalOpen || isEditPasswordModalOpen;
  React.useEffect(() => {
    const handleClickClose = (event) => {
      if (event.target.classList.contains('modal_opened')) {
        closeAllPopups();
      }
    };

    const handleEscClose = (event) => {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    };

    if (isAnyPopupOpen) {
      document.addEventListener('click', handleClickClose);
      document.addEventListener('keydown', handleEscClose);
    }

    return () => {
      document.removeEventListener('click', handleClickClose);
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [isAnyPopupOpen]);

  const closeAllPopups = () => {
    //Remove the code below & set modal's specific setState function to false
    setIsLoginOpen(false);
    setIsEditPasswordModalOpen(false);
    setIsEditProfileDataModalOpen(false);
  };
  // mock clothingCardData for testing ClothingCard component, please test the like button
  // by changing favorited from true to false
  const clothingCardData = {
    name: 'T-shirt',
    imageUrl: 'https://hollywoodchamber.net/wp-content/uploads/2020/06/tshirt-2.jpg',
    isLiked: true,
    type: 't-shirt',
  };
  function handleLikeClick(cardData) {
    console.log(cardData);
    // insert logic to interact with WTWR API
    setIsLoginOpen(false);
  }

  const handleLoginSubmit = () => {
    //call the auth.login(loginEmail, loginPassword)
    //if login successful
    setCurrentUserEmail(loginEmail);
    setLoginEmail('');
    setLoginPassword('');
    setIsLoggedIn(true);
    //else catch error
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    setCurrentUserEmail('');
  };

  const handleUpdateProfileData = (userData) => {
    console.log(`api patch will be implemented - ${userData}`);
  };
  const handlelChangePasswordSubmit = (password) => {
    console.log('new password set');
  };
  return (
    <div className="page">
      <div className="page__wrapper">
      <CurrentUserContext.Provider value={currentUser}>
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          {/* isLoggedIn will be determined by a future user context */}
          {/* I left the userName state in for the purpose of seeing the different navigation css */}
          <Navigation
            isLoggedIn={isLoggedIn}
            /** rewrite `{userName}` to `{currentUser}` when ready */
            username={userName}
            hasAvatar={userAvatar}
            /** place signup modal open state here */
            /** place login modal open state here */
          />
          App
          {/* Replace the ModalWithForm below with specific modals */}
          <Login
            isOpen={isLoginOpen}
            onClose={closeAllPopups}
            onSubmit={handleLoginSubmit}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
          />
          <WeatherCards timeOfTheDay={timeOfTheDay} description="Data from Weather API" />
          <Main />
          <EditProfileDataModal
            isOpen={isEditProfileDataModalOpen}
            onClose={closeAllPopups}
            onUpdateUserProfile={handleUpdateProfileData}
          />
          <EditPasswordModal
            isOpen={isEditPasswordModalOpen}
            onClose={closeAllPopups}
            onUpdatePassword={handlelChangePasswordSubmit}
          />
          <Profile cardData={clothingCardData} onCardLike={handleLikeClick} />
          <Footer />
        </CurrentTemperatureUnitContext.Provider>
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
};

export default App;
