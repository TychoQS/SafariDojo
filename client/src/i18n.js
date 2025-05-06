import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources for each language
const resources = {
    en: {
        translation: {
            home: 'Home',
            profile: 'Profile',
            logout: 'Log Out',
            signup: 'Sign Up',
            login: 'Log In',
            logoutModalTitle: 'Are you sure you want to log out?',
            logoutModalDescription: 'You will be logged out of your account.',
            yes: 'Yes',
            no: 'No',
            chooseMaster: 'Choose any Master!',
            popularGames: 'Most Popular Games',
            searchResults: 'Search Results',
            searchPlaceholder: 'Search...',
            loadingGames: 'Loading popular games...',
            searchingGames: 'Searching games...',
            noGamesFound: 'No games found with that term. Try another search.',
            noPopularGames: 'No popular games available at this time.',
            errorLoadingGames: 'Could not load popular games. Please try again later.',
            errorSearchingGames: 'Error searching games. Please try again later.',
            difficulty: {
                easy: 'Easy',
                medium: 'Medium',
                hard: 'Hard'
            },
            modal: {
                select_difficulty: 'Please select a difficulty!',
                must_login: 'You must log in!',
                got_it: 'Got it!',
                login: 'Log In',
                cancel: 'Cancel'
            },
            subjects: {
                English: 'English',
                Science: 'Science',
                Art: 'Art',
                Maths: 'Maths',
                Geography: 'Geography'
            },
            hoverText: {
                English: "Hi, I'm Owling, and with me, you'll master English like never before!",
                Science: "Hi, I'm Freddy, and with me, you'll discover the wonders of Science!",
                Art: "Hey, I'm Perry, and together, we'll unlock the secrets of Art!",
                Maths: "Hey, I'm Emily, and Maths will never be the same with me around!",
                Geography: "Hi, I'm Kanye, and Geography will be your new favorite subject with me!",
            },
            name: 'Name',
            email: 'Email',
            editprofile: 'edit profile',
            myprofile: 'My profile',
            editprofileTitle: 'Edit your profile',
            cancelButton: 'cancel',
            saveButton: 'save',
        },
    },
    es: {
        translation: {
            home: 'Inicio',
            profile: 'Perfil',
            logout: 'Cerrar Sesión',
            signup: 'Registrarse',
            login: 'Iniciar Sesión',
            logoutModalTitle: '¿Estás seguro de que quieres cerrar sesión?',
            logoutModalDescription: 'Se cerrará la sesión de tu cuenta.',
            yes: 'Sí',
            no: 'No',
            chooseMaster: '¡Elige cualquier Maestro!',
            popularGames: 'Juegos Más Populares',
            searchResults: 'Resultados de Búsqueda',
            searchPlaceholder: 'Buscar...',
            loadingGames: 'Cargando juegos populares...',
            searchingGames: 'Buscando juegos...',
            noGamesFound: 'No se encontraron juegos con ese término. Prueba con otra búsqueda.',
            noPopularGames: 'No hay juegos populares disponibles en este momento.',
            errorLoadingGames: 'No se pudieron cargar los juegos populares. Por favor, inténtalo más tarde.',
            errorSearchingGames: 'Error al buscar juegos. Por favor, inténtalo más tarde.',
            difficulty: {
                easy: 'Fácil',
                medium: 'Medio',
                hard: 'Difícil'
            },
            modal: {
                select_difficulty: '¡Por favor, selecciona una dificultad!',
                must_login: '¡Debes iniciar sesión!',
                got_it: '¡Entendido!',
                login: 'Iniciar sesión',
                cancel: 'Cancelar'
            },
            subjects: {
                English: 'Inglés',
                Science: 'Ciencias',
                Art: 'Arte',
                Maths: 'Matemáticas',
                Geography: 'Geografía'
            },
            hoverText: {
                English: "¡Hola, soy Owling, y conmigo dominarás el inglés como nunca antes!",
                Science: "¡Hola, soy Freddy, y conmigo descubrirás las maravillas de las ciencias!",
                Art: "¡Oye, soy Perry, y juntos desbloquearemos los secretos del arte!",
                Maths: "¡Oye, soy Emily, y las matemáticas nunca serán lo mismo conmigo!",
                Geography: "¡Hola, soy Kanye, y la geografía será tu asignatura favorita conmigo!",
            },
            name: 'Nombre',
            email: 'Correo electrónico',
            editprofile: 'editar perfil',
            myprofile: 'Mi perfil',
            editprofileTitle: 'Edita tu perfil',
            cancelButton: 'cancelar',
            saveButton: 'guardar',
        },
    },
    fr: {
        translation: {
            home: 'Accueil',
            profile: 'Profil',
            logout: 'Déconnexion',
            signup: 'S’inscrire',
            login: 'Se connecter',
            logoutModalTitle: 'Êtes-vous sûr de vouloir vous déconnecter ?',
            logoutModalDescription: 'Vous serez déconnecté de votre compte.',
            yes: 'Oui',
            no: 'Non',
            chooseMaster: 'Choisissez n’importe quel Maître !',
            popularGames: 'Jeux les plus populaires',
            searchResults: 'Résultats de recherche',
            searchPlaceholder: 'Rechercher...',
            loadingGames: 'Chargement des jeux populaires...',
            searchingGames: 'Recherche de jeux...',
            noGamesFound: 'Aucun jeu trouvé avec ce terme. Essayez une autre recherche.',
            noPopularGames: 'Aucun jeu populaire disponible pour le moment.',
            errorLoadingGames: 'Impossible de charger les jeux populaires. Veuillez réessayer plus tard.',
            errorSearchingGames: 'Erreur lors de la recherche de jeux. Veuillez réessayer plus tard.',
            difficulty: {
                easy: 'Facile',
                medium: 'Moyen',
                hard: 'Difficile'
            },
            modal: {
                select_difficulty: 'Veuillez sélectionner une difficulté!',
                must_login: 'Vous devez vous connecter!',
                got_it: 'Compris!',
                login: 'Se connecter',
                cancel: 'Annuler'
            },
            subjects: {
                English: 'Anglais',
                Science: 'Sciences',
                Art: 'Art',
                Maths: 'Mathématiques',
                Geography: 'Géographie'
            },
            hoverText: {
                English: "Salut, je suis Owling, et avec moi, tu maîtriseras l'anglais comme jamais!",
                Science: "Salut, je suis Freddy, et avec moi, tu découvriras les merveilles des sciences!",
                Art: "Salut, je suis Perry, et ensemble, nous dévoilerons les secrets de l'art!",
                Maths: "Salut, je suis Emily, et les maths ne seront plus jamais les mêmes avec moi!",
                Geography: "Salut, je suis Kanye, et la géographie deviendra ton sujet préféré avec moi!",
            },
            name: 'Nom',
            email: 'Email',
            editprofile: 'modifier le profil',
            myprofile: 'Mon profil',
            editprofileTitle: 'Modifier votre profil',
            cancelButton: 'annuler',
            saveButton: 'suvegarder',
        },
    },
    de: {
        translation: {
            home: 'Startseite',
            profile: 'Profil',
            logout: 'Abmelden',
            signup: 'Registrieren',
            login: 'Anmelden',
            logoutModalTitle: 'Sind Sie sicher, dass Sie sich abmelden möchten?',
            logoutModalDescription: 'Sie werden von Ihrem Konto abgemeldet.',
            yes: 'Ja',
            no: 'Nein',
            chooseMaster: 'Wählen Sie einen Meister!',
            popularGames: 'Beliebteste Spiele',
            searchResults: 'Suchergebnisse',
            searchPlaceholder: 'Suchen...',
            loadingGames: 'Beliebte Spiele werden geladen...',
            searchingGames: 'Spiele werden gesucht...',
            noGamesFound: 'Keine Spiele mit diesem Begriff gefunden. Versuchen Sie eine andere Suche.',
            noPopularGames: 'Derzeit sind keine beliebten Spiele verfügbar.',
            errorLoadingGames: 'Beliebte Spiele konnten nicht geladen werden. Bitte versuchen Sie es später erneut.',
            errorSearchingGames: 'Fehler beim Suchen nach Spielen. Bitte versuchen Sie es später erneut.',
            difficulty: {
                easy: 'Einfach',
                medium: 'Mittel',
                hard: 'Schwer'
            },
            modal: {
                select_difficulty: 'Bitte wähle einen Schwierigkeitsgrad!',
                must_login: 'Du musst dich anmelden!',
                got_it: 'Verstanden!',
                login: 'Anmelden',
                cancel: 'Abbrechen'
            },
            subjects: {
                English: 'Englisch',
                Science: 'Naturwissenschaften',
                Art: 'Kunst',
                Maths: 'Mathematik',
                Geography: 'Geografie'
            },
            hoverText: {
                English: "Hallo, ich bin Owling, und mit mir wirst du Englisch wie nie zuvor meistern!",
                Science: "Hallo, ich bin Freddy, und mit mir wirst du die Wunder der Naturwissenschaften entdecken!",
                Art: "Hey, ich bin Perry, und zusammen werden wir die Geheimnisse der Kunst entschlüsseln!",
                Maths: "Hey, ich bin Emily, und Mathematik wird mit mir nie mehr dasselbe sein!",
                Geography: "Hallo, ich bin Kanye, und Geografie wird mit mir dein neues Lieblingsfach!",
            },

            name: 'Name',
            email: 'Email',
            editprofile: 'profil bearbeiten',
            myprofile: 'Mein Profil',
            editprofileTitle: 'Bearbeite dein Profil',
            cancelButton: 'retten',
            saveButton: 'abbrechen',

        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;