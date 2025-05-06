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
            }
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
            }

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
            }
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
            }
        },
    },
};

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Bind i18next to React
    .init({
        resources,
        fallbackLng: 'en', // Default language if detection fails
        detection: {
            order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
            caches: ['localStorage'], // Cache language in localStorage
        },
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;