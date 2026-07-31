const guitarLessons = [
  {
    number: "01",
    title: "Guitar Lesson 1",
    description: "Start here",
    youtube: "https://youtu.be/hNE0Yx9Zr3c?si=rBQnrqxuasQ9ogl5"
  },
  {
    number: "02",
    title: "Guitar Lesson 2",
    description: "Build the foundation",
    youtube: "https://youtu.be/r2nKjrL3ZkU?si=JybSaHms8hq65Yam"
  },
  {
    number: "03",
    title: "Guitar Lesson 3",
    description: "Keep progressing",
    youtube: "https://youtu.be/ocIX9BZT_W4?si=rFIWIH2_pXYBP3ca"
  },
  {
    number: "04",
    title: "Guitar Lesson 4",
    description: "Put it together",
    youtube: "https://youtu.be/zVZ0AZ54GTU?si=bXnYR6TfA8ExHTf_"
  }
];

const chordGuides = [
  {
    key: "G",
    title: "Chords in the key of G",
    description: "Open the printable PDF guide",
    url: "https://drive.google.com/file/d/1klgi2Zued9plRGzklegGR6aOQy0pdis2/view?usp=drive_link"
  },
  {
    key: "E",
    title: "Chords in the key of E",
    description: "Open the printable PDF guide",
    url: "https://drive.google.com/file/d/1cDH0dRRc87wt3_sCDamiU8Wd2jAsJsGA/view?usp=drive_link"
  }
];

const practiceDialog = document.getElementById("youtubeModal");
const lessonsGrid = document.getElementById("lessonsGrid");
const guidesGrid = document.getElementById("guidesGrid");
const sheetSection = document.getElementById("sheetSection");
const sheetHeading = document.getElementById("sheetHeading");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalMeta = document.getElementById("modalMeta");
const viewerActions = document.getElementById("viewerActions");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");

document.querySelector(".hero-note-number").textContent = String(songs.length);
searchInput.placeholder = `Search ${songs.length} worship songs…`;

getYouTubeId = function (url) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (host.endsWith("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(pathParts[0])) {
        return pathParts[1] || null;
      }
    }
  } catch (error) {
    return null;
  }

  return null;
};

function drivePreviewUrl(url) {
  const match = url && url.match(/\/d\/([\w-]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
}

function makeExternalLink(label, url, className = "viewer-link") {
  const link = document.createElement("a");
  link.className = className;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function makeVideoIframe(videoId, title) {
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
  iframe.title = title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  return iframe;
}

function clearViewer() {
  document.getElementById("youtubeContainer").replaceChildren();
  document.getElementById("chordsPdfContainer").replaceChildren();
  viewerActions.replaceChildren();
  sheetSection.classList.remove("is-hidden");
  document.getElementById("chordsPdfContainer").classList.remove("resource-mode");
}

function showDialog() {
  if (typeof practiceDialog.showModal === "function") {
    practiceDialog.showModal();
  } else {
    practiceDialog.setAttribute("open", "");
  }
}

function openSong(song) {
  clearViewer();

  const videoId = getYouTubeId(song.youtube);
  if (!videoId) {
    window.open(song.chords, "_blank", "noopener,noreferrer");
    return;
  }

  modalEyebrow.textContent = "Song practice";
  document.getElementById("modalTitle").textContent = song.title;
  modalMeta.textContent = `Key of ${song.key}`;
  sheetHeading.textContent = "Use the chord sheet";

  document
    .getElementById("youtubeContainer")
    .appendChild(makeVideoIframe(videoId, `${song.title} play-through video`));

  viewerActions.append(
    makeExternalLink("Open chord sheet in a new tab ↗", song.chords),
    makeExternalLink("Watch on YouTube ↗", song.youtube)
  );

  const pdfFrame = document.createElement("iframe");
  pdfFrame.src = drivePreviewUrl(song.chords);
  pdfFrame.title = `${song.title} chord sheet`;
  pdfFrame.loading = "lazy";
  document.getElementById("chordsPdfContainer").appendChild(pdfFrame);

  showDialog();
}

function openLesson(lesson) {
  clearViewer();

  const videoId = getYouTubeId(lesson.youtube);
  modalEyebrow.textContent = "Guitar foundations";
  document.getElementById("modalTitle").textContent = lesson.title;
  modalMeta.textContent = "Part of Dave Partin’s four-lesson series";
  sheetHeading.textContent = "Keep the chord guides nearby";

  document
    .getElementById("youtubeContainer")
    .appendChild(makeVideoIframe(videoId, lesson.title));

  viewerActions.appendChild(makeExternalLink("Watch on YouTube ↗", lesson.youtube));

  const resourceContainer = document.getElementById("chordsPdfContainer");
  resourceContainer.classList.add("resource-mode");
  const resourceGrid = document.createElement("div");
  resourceGrid.className = "lesson-resources";

  chordGuides.forEach((guide) => {
    const link = makeExternalLink("", guide.url, "lesson-resource");
    const label = document.createElement("span");
    label.textContent = "PDF chord guide";
    const title = document.createElement("strong");
    title.textContent = `Key of ${guide.key} chords ↗`;
    link.append(label, title);
    resourceGrid.appendChild(link);
  });

  resourceContainer.appendChild(resourceGrid);
  showDialog();
}

openYouTube = function (song) {
  openSong(song);
};

closeModal = function () {
  if (practiceDialog.open && typeof practiceDialog.close === "function") {
    practiceDialog.close();
  } else {
    practiceDialog.removeAttribute("open");
    clearViewer();
  }
};

createSongElement = function (song, isFavorite) {
  const songItem = document.createElement("article");
  songItem.className = `song-item ${isFavorite ? "favorite" : ""}`;

  const info = document.createElement("div");
  info.className = "song-info";

  const title = document.createElement("h3");
  title.className = "song-title";
  title.textContent = song.title;

  const key = document.createElement("div");
  key.className = "song-key";
  key.append("Key of ");

  const keyBadge = document.createElement("span");
  keyBadge.className = "key-badge";
  keyBadge.textContent = song.key;
  key.appendChild(keyBadge);
  info.append(title, key);

  const actions = document.createElement("div");
  actions.className = "song-actions";

  if (song.youtube) {
    const practiceButton = document.createElement("button");
    practiceButton.className = "action-btn";
    practiceButton.type = "button";
    practiceButton.setAttribute("aria-label", `Watch ${song.title} and view its chord sheet`);
    practiceButton.innerHTML =
      '<span class="action-icon" aria-hidden="true">▶</span><span class="action-label">Watch + chords</span>';
    practiceButton.addEventListener("click", () => openSong(song));
    actions.appendChild(practiceButton);
  } else {
    const chordsLink = makeExternalLink("", song.chords, "action-btn");
    chordsLink.setAttribute("aria-label", `Open the chord sheet for ${song.title}`);
    chordsLink.innerHTML =
      '<span class="action-icon" aria-hidden="true">↗</span><span class="action-label">Open chords</span>';
    actions.appendChild(chordsLink);
  }

  const favoriteButton = document.createElement("button");
  const saved = favorites.includes(song.title);
  favoriteButton.className = `favorite-toggle ${saved ? "active" : ""}`;
  favoriteButton.type = "button";
  favoriteButton.textContent = saved ? "♥" : "♡";
  favoriteButton.title = saved ? "Remove from favorites" : "Save to favorites";
  favoriteButton.setAttribute(
    "aria-label",
    `${saved ? "Remove" : "Save"} ${song.title} ${saved ? "from" : "to"} favorites`
  );
  favoriteButton.setAttribute("aria-pressed", String(saved));
  favoriteButton.addEventListener("click", () => toggleFavorite(song.title));
  actions.appendChild(favoriteButton);

  songItem.append(info, actions);
  return songItem;
};

renderSongs = function () {
  const songsList = document.getElementById("songsList");
  const favoritesList = document.getElementById("favoritesList");
  const favoritesSection = document.getElementById("favoritesSection");
  const mainSection = document.getElementById("mainSection");
  const noResults = document.getElementById("noResults");
  const favoritesButton = document.getElementById("favoritesToggle");

  songsList.replaceChildren();
  favoritesList.replaceChildren();

  const filteredSongs = songs.filter((song) => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && matchesFilter(song);
  });

  const favoriteSongs = filteredSongs.filter((song) => favorites.includes(song.title));
  const regularSongs = filteredSongs.filter((song) => !favorites.includes(song.title));
  const visibleCount = showFavoritesOnly ? favoriteSongs.length : filteredSongs.length;

  favoritesButton.classList.toggle("active", showFavoritesOnly);
  favoritesButton.textContent = showFavoritesOnly ? "Show all songs" : "♡ Favorites only";
  resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "song" : "songs"}`;

  if (showFavoritesOnly) {
    favoritesSection.style.display = "block";
    mainSection.style.display = "none";

    favoriteSongs.forEach((song) => {
      favoritesList.appendChild(createSongElement(song, true));
    });
  } else {
    favoritesSection.style.display = favoriteSongs.length ? "block" : "none";
    mainSection.style.display = "block";

    favoriteSongs.forEach((song) => {
      favoritesList.appendChild(createSongElement(song, true));
    });

    const groupedSongs = regularSongs.reduce((groups, song) => {
      const firstLetter = song.title[0].toUpperCase();
      groups[firstLetter] ||= [];
      groups[firstLetter].push(song);
      return groups;
    }, {});

    Object.keys(groupedSongs)
      .sort()
      .forEach((letter) => {
        const header = document.createElement("div");
        header.className = "section-header";
        header.textContent = letter;
        songsList.appendChild(header);

        groupedSongs[letter].forEach((song) => {
          songsList.appendChild(createSongElement(song, false));
        });
      });
  }

  noResults.style.display = visibleCount === 0 ? "flex" : "none";
};

function renderLessons() {
  const lessonFragment = document.createDocumentFragment();

  guitarLessons.forEach((lesson) => {
    const card = document.createElement("article");
    card.className = "lesson-card";

    const button = document.createElement("button");
    button.className = "lesson-button";
    button.type = "button";
    button.setAttribute("aria-label", `Watch ${lesson.title}`);

    const thumbnail = document.createElement("div");
    thumbnail.className = "lesson-thumbnail";

    const image = document.createElement("img");
    image.src = `https://i.ytimg.com/vi/${getYouTubeId(lesson.youtube)}/hqdefault.jpg`;
    image.alt = "";
    image.loading = "lazy";

    const playMark = document.createElement("span");
    playMark.className = "play-mark";
    playMark.setAttribute("aria-hidden", "true");
    thumbnail.append(image, playMark);

    const copy = document.createElement("div");
    copy.className = "lesson-copy";

    const number = document.createElement("span");
    number.className = "lesson-number";
    number.textContent = lesson.number;

    const text = document.createElement("div");
    const title = document.createElement("span");
    title.className = "lesson-title";
    title.textContent = lesson.title;
    const action = document.createElement("span");
    action.className = "lesson-action";
    action.textContent = lesson.description;
    text.append(title, action);

    copy.append(number, text);
    button.append(thumbnail, copy);
    button.addEventListener("click", () => openLesson(lesson));
    card.appendChild(button);
    lessonFragment.appendChild(card);
  });

  lessonsGrid.replaceChildren(lessonFragment);
}

function renderGuides() {
  const guideFragment = document.createDocumentFragment();

  chordGuides.forEach((guide) => {
    const card = makeExternalLink("", guide.url, "guide-card");
    card.setAttribute("aria-label", `Open ${guide.title}`);

    const copy = document.createElement("div");
    const label = document.createElement("span");
    label.className = "guide-label";
    label.textContent = "Printable PDF";
    const title = document.createElement("h3");
    title.textContent = guide.title;
    const description = document.createElement("p");
    description.textContent = guide.description;
    copy.append(label, title, description);

    const arrow = document.createElement("span");
    arrow.className = "guide-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    card.append(copy, arrow);
    guideFragment.appendChild(card);
  });

  guidesGrid.replaceChildren(guideFragment);
}

practiceDialog.addEventListener("close", clearViewer);

renderLessons();
renderGuides();
renderSongs();
