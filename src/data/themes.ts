export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'events' | 'fun' | 'holidays';
  icon: string;
  prompt: string;
  previewColor: string;
  previewImage: string; // New field for visual example
}

export const themes: Theme[] = [
  // Event Types
  {
    id: 'wedding',
    name: 'Wedding Elegance',
    description: 'Romantic, dreamy bridal aesthetic',
    category: 'events',
    icon: '💒',
    prompt: 'Transform this photo into an elegant wedding portrait. Add soft romantic lighting, subtle flower petals floating in the background, a dreamy bokeh effect, and give the person an elegant, sophisticated look as if they were at a luxury wedding venue. Keep their face recognizable but enhance with soft glamour makeup effects and warm golden lighting. Make it feel like a professional wedding photo.',
    previewColor: 'from-rose-100 to-pink-200',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    description: 'Balloons, confetti & party vibes',
    category: 'events',
    icon: '🎂',
    prompt: 'Transform this photo into a fun birthday party celebration scene. Add colorful balloons, confetti falling from above, party streamers, and festive lighting with colorful bokeh. Give the person a party hat or crown and make them look like the star of the celebration. Add sparkles and make the overall mood joyful and celebratory.',
    previewColor: 'from-yellow-100 to-orange-200',
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'corporate',
    name: 'Corporate Professional',
    description: 'Polished executive portrait',
    category: 'events',
    icon: '💼',
    prompt: 'Transform this photo into a professional corporate headshot. Add a clean, modern office background with soft professional lighting. Give the person a polished, confident look with professional attire (suit or business wear). Use neutral, sophisticated colors and make it look like a LinkedIn professional photo or executive portrait.',
    previewColor: 'from-slate-100 to-blue-200',
    previewImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'quinceanera',
    name: 'Quinceañera Princess',
    description: 'Elegant gown, tiara & flowers',
    category: 'events',
    icon: '👑',
    prompt: 'Transform this photo into a stunning Quinceañera princess portrait. Add an elegant ball gown in pink or purple, a sparkling tiara, beautiful flower arrangements, and a grand ballroom background. Add soft romantic lighting, sparkles, and make it feel like a magical princess celebration. Include elegant jewelry and a sophisticated updo hairstyle.',
    previewColor: 'from-pink-100 to-purple-200',
    previewImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop&q=80',
  },
  // MAKE ME LAUGH - EVENTS
  {
    id: 'make-me-laugh-events',
    name: 'Make Me Laugh!',
    description: 'Surprise me with a funny event mashup!',
    category: 'events',
    icon: '😂',
    prompt: 'Transform this photo into a hilariously unexpected event scene. Combine elements from a wedding, a birthday, and a corporate meeting in a funny, absurd, and unique way. For example, a person in a wedding dress with a party hat giving a serious corporate presentation. The goal is to make the user laugh with the output.',
    previewColor: 'from-red-200 to-yellow-200',
    previewImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=400&fit=crop&q=80',
  },
  // Fun Styles
  {
    id: 'superhero',
    name: 'Superhero',
    description: 'Comic book hero transformation',
    category: 'fun',
    icon: '🦸',
    prompt: 'Transform this photo into an epic superhero portrait. Give the person a colorful superhero costume with a cape, add dynamic comic book style lighting and effects, and place them against a dramatic city skyline or action scene background. Add energy effects, wind-blown elements, and make it look like a movie poster for a superhero film. Keep their face recognizable but heroic.',
    previewColor: 'from-red-100 to-blue-200',
    previewImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'vintage',
    name: 'Vintage Hollywood',
    description: 'Classic glamour from the golden age',
    category: 'fun',
    icon: '🎬',
    prompt: 'Transform this photo into a classic vintage Hollywood glamour portrait from the 1940s-1950s. Add black and white or sepia toning, dramatic film noir lighting, and give the person an old Hollywood movie star look with elegant vintage styling. Add film grain, soft focus effects, and make it look like a classic cinema still photograph.',
    previewColor: 'from-amber-100 to-stone-200',
    previewImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80&sat=-100',
  },
  {
    id: 'disco',
    name: 'Disco Fever',
    description: '70s sparkle and glam',
    category: 'fun',
    icon: '🪩',
    prompt: 'Transform this photo into a groovy 1970s disco scene. Add a disco ball, colorful strobe lighting, sparkly outfits with platform shoes, and a retro dance floor background. Include rainbow light reflections, glitter effects, and funky disco fashion. Make it feel like Saturday Night Fever with vibrant colors and that iconic disco atmosphere.',
    previewColor: 'from-purple-200 to-pink-300',
    previewImage: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'western',
    name: 'Western Cowboy',
    description: 'Wild West ranch aesthetic',
    category: 'fun',
    icon: '🤠',
    prompt: 'Transform this photo into a Wild West cowboy/cowgirl portrait. Add a cowboy hat, western attire with boots and possibly a bandana, and place them in a desert sunset or rustic ranch setting. Include elements like a lasso, wooden fence, horses in the background, and warm golden hour lighting. Make it look like an authentic Western movie poster.',
    previewColor: 'from-amber-200 to-orange-300',
    previewImage: 'https://images.unsplash.com/photo-1508835277982-1c1b0e205603?w=400&h=400&fit=crop&q=80',
  },
  // MAKE ME LAUGH - FUN
  {
    id: 'make-me-laugh-fun',
    name: 'Make Me Laugh!',
    description: 'Surprise me with a funny style mashup!',
    category: 'fun',
    icon: '🤣',
    prompt: 'Transform this photo into a hilariously unexpected style mashup. Combine elements from a superhero, a vintage Hollywood star, and a disco dancer in a funny, absurd, and unique way. For example, a superhero in a vintage gown on a disco floor. The goal is to make the user laugh with the output.',
    previewColor: 'from-lime-200 to-green-200',
    previewImage: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400&h=400&fit=crop&q=80',
  },
  // Holidays
  {
    id: 'christmas',
    name: 'Christmas Elf',
    description: "Santa's workshop helper",
    category: 'holidays',
    icon: '🎄',
    prompt: "Transform this photo into a magical Christmas elf portrait. Give the person a festive elf costume with pointy ears and a fun hat, place them in Santa's workshop with toys and presents around, add falling snow, twinkling lights, and Christmas decorations. Make it feel warm, magical, and full of holiday cheer.",
    previewColor: 'from-green-100 to-red-200',
    previewImage: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'halloween',
    name: 'Halloween Spooky',
    description: 'Vampire, witch, or monster',
    category: 'holidays',
    icon: '🎃',
    prompt: 'Transform this photo into a spooky Halloween portrait. Turn the person into a stylish vampire, witch, or elegant gothic creature. Add a haunted house background, full moon, bats flying, jack-o-lanterns, and eerie purple and orange lighting. Make it scary but fun, like a classic Halloween movie poster.',
    previewColor: 'from-orange-200 to-purple-300',
    previewImage: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'valentines',
    name: "Valentine's Romance",
    description: 'Hearts, pink & red aesthetic',
    category: 'holidays',
    icon: '💕',
    prompt: "Transform this photo into a romantic Valentine's Day portrait. Add floating hearts, rose petals, soft pink and red lighting, and a dreamy romantic background. Give the person an elegant, romantic look with subtle heart-themed accessories. Add sparkles, soft bokeh effects, and make it feel like a love story movie poster.",
    previewColor: 'from-red-100 to-pink-200',
    previewImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop&q=80',
  },
  {
    id: 'july4th',
    name: '4th of July',
    description: 'Patriotic stars & stripes',
    category: 'holidays',
    icon: '🇺🇸',
    prompt: 'Transform this photo into a patriotic 4th of July celebration portrait. Add American flag elements, red white and blue colors, fireworks in the background, and patriotic decorations. Give the person festive American-themed attire or accessories. Add sparklers, confetti in flag colors, and make it feel like an epic Independence Day celebration.',
    previewColor: 'from-blue-200 to-red-200',
    previewImage: 'https://images.unsplash.com/photo-1498931299839-0b870292d86d?w=400&h=400&fit=crop&q=80',
  },
  // MAKE ME LAUGH - HOLIDAYS
  {
    id: 'make-me-laugh-holidays',
    name: 'Make Me Laugh!',
    description: 'Surprise me with a funny holiday mashup!',
    category: 'holidays',
    icon: '🤪',
    prompt: 'Transform this photo into a hilariously unexpected holiday mashup. Combine elements from Christmas, Halloween, and Valentine\'s Day in a funny, absurd, and unique way. For example, a Christmas elf dressed as a vampire holding a heart-shaped box of chocolates. The goal is to make the user laugh with the output.',
    previewColor: 'from-pink-200 to-blue-200',
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=400&fit=crop&q=80',
  },
];

export const themeCategories = [
  { id: 'events', name: 'Event Types', icon: '🎉' },
  { id: 'fun', name: 'Fun Styles', icon: '🎭' },
  { id: 'holidays', name: 'Holidays', icon: '🎄' },
] as const;

export type ThemeCategory = typeof themeCategories[number]['id'];
