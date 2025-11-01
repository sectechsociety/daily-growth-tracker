// Comprehensive Indian Food Database - 200+ dishes
// Organized by region and category (fat_loss, muscle_gain, balanced)

export const INDIAN_FOOD_DATABASE = {
  // North Indian Cuisine (Punjab, Delhi, Haryana, UP, Rajasthan, Kashmir)
  north_indian: {
    fat_loss: [
      { id: "nfl1", name: "Tandoori Roti (1 piece)", calories: 70, protein: 3, carbs: 15, fat: 0.5, region: "North", benefits: ["Low fat", "High fiber"] },
      { id: "nfl2", name: "Dal Makhani (1 bowl, less butter)", calories: 200, protein: 12, carbs: 30, fat: 5, region: "Punjab", benefits: ["High protein", "Fiber rich"] },
      { id: "nfl3", name: "Kadhi Pakora (1 bowl, less oil)", calories: 180, protein: 8, carbs: 25, fat: 5, region: "Rajasthan", benefits: ["Probiotic", "High protein"] },
      { id: "nfl4", name: "Sarson ka Saag (1 bowl)", calories: 150, protein: 6, carbs: 20, fat: 5, region: "Punjab", benefits: ["Iron rich", "High fiber"] },
      { id: "nfl5", name: "Aloo Gobi (1 bowl)", calories: 120, protein: 4, carbs: 20, fat: 3, region: "North", benefits: ["Vitamin C", "Fiber rich"] },
      { id: "nfl6", name: "Methi Paratha (1 piece, less oil)", calories: 120, protein: 5, carbs: 20, fat: 2, region: "North", benefits: ["Iron rich", "High fiber"] },
      { id: "nfl7", name: "Kadai Paneer (1 bowl, less oil)", calories: 250, protein: 15, carbs: 10, fat: 15, region: "North", benefits: ["High protein", "Calcium rich"] },
      { id: "nfl8", name: "Bhindi Masala (1 bowl)", calories: 100, protein: 4, carbs: 15, fat: 3, region: "North", benefits: ["Low calorie", "High fiber"] },
      { id: "nfl9", name: "Lauki Chana Dal (1 bowl)", calories: 180, protein: 10, carbs: 25, fat: 4, region: "North", benefits: ["High fiber", "Low fat"] },
      { id: "nfl10", name: "Dahi Bhalla (1 piece, low fat)", calories: 100, protein: 5, carbs: 15, fat: 2, region: "Delhi", benefits: ["Probiotic", "Protein rich"] },
      { id: "nfl11", name: "Rajma Chawal (1 bowl, brown rice)", calories: 350, protein: 15, carbs: 60, fat: 5, region: "Punjab", benefits: ["Complete protein", "High fiber"] },
      { id: "nfl12", name: "Chole Chawal (1 bowl, brown rice)", calories: 380, protein: 14, carbs: 65, fat: 6, region: "North", benefits: ["Plant protein", "Fiber rich"] },
      { id: "nfl13", name: "Aloo Methi (1 bowl)", calories: 150, protein: 5, carbs: 25, fat: 4, region: "North", benefits: ["Iron rich", "High fiber"] },
      { id: "nfl14", name: "Kaddu Ki Sabzi (1 bowl)", calories: 120, protein: 3, carbs: 20, fat: 3, region: "North", benefits: ["Low calorie", "High fiber"] },
      { id: "nfl15", name: "Mushroom Masala (1 bowl)", calories: 140, protein: 8, carbs: 15, fat: 5, region: "North", benefits: ["Low calorie", "High protein"] }
    ],
    muscle_gain: [
      { id: "nmg1", name: "Butter Chicken (1 bowl)", calories: 450, protein: 35, carbs: 15, fat: 28, region: "Punjab", benefits: ["High protein", "Muscle building"] },
      { id: "nmg2", name: "Dal Makhani (1 bowl)", calories: 350, protein: 15, carbs: 35, fat: 18, region: "Punjab", benefits: ["Plant protein", "High calorie"] },
      { id: "nmg3", name: "Chole Bhature (1 plate)", calories: 600, protein: 20, carbs: 80, fat: 25, region: "Punjab", benefits: ["High calorie", "Protein rich"] },
      { id: "nmg4", name: "Rajma Chawal (1 plate)", calories: 500, protein: 25, carbs: 75, fat: 12, region: "Punjab", benefits: ["Complete protein", "High calorie"] },
      { id: "nmg5", name: "Paneer Butter Masala (1 bowl)", calories: 450, protein: 25, carbs: 20, fat: 30, region: "North", benefits: ["High protein", "Calcium rich"] },
      { id: "nmg6", name: "Amritsari Fish (2 pieces)", calories: 400, protein: 45, carbs: 10, fat: 22, region: "Punjab", benefits: ["High protein", "Omega-3"] },
      { id: "nmg7", name: "Mutton Rogan Josh (1 bowl)", calories: 500, protein: 40, carbs: 15, fat: 35, region: "Kashmir", benefits: ["High protein", "Iron rich"] },
      { id: "nmg8", name: "Kadai Paneer (1 bowl)", calories: 400, protein: 25, carbs: 20, fat: 25, region: "North", benefits: ["High protein", "Calcium rich"] },
      { id: "nmg9", name: "Malai Kofta (2 pieces)", calories: 450, protein: 15, carbs: 35, fat: 30, region: "North", benefits: ["Protein rich", "High calorie"] },
      { id: "nmg10", name: "Butter Naan (1 piece)", calories: 350, protein: 10, carbs: 45, fat: 15, region: "North", benefits: ["High calorie", "Energy dense"] },
      { id: "nmg11", name: "Dal Tadka (1 bowl with ghee)", calories: 300, protein: 15, carbs: 30, fat: 15, region: "North", benefits: ["Plant protein", "High calorie"] },
      { id: "nmg12", name: "Chicken Tikka Masala (1 bowl)", calories: 450, protein: 40, carbs: 20, fat: 25, region: "Punjab", benefits: ["High protein", "Muscle building"] },
      { id: "nmg13", name: "Mutton Korma (1 bowl)", calories: 500, protein: 45, carbs: 20, fat: 30, region: "Lucknow", benefits: ["High protein", "Iron rich"] },
      { id: "nmg14", name: "Paneer Tikka (6 pieces)", calories: 350, protein: 30, carbs: 10, fat: 25, region: "North", benefits: ["High protein", "Calcium rich"] },
      { id: "nmg15", name: "Rogan Josh (1 bowl)", calories: 450, protein: 35, carbs: 15, fat: 30, region: "Kashmir", benefits: ["High protein", "Iron rich"] }
    ]
  },

  // South Indian Cuisine (Tamil Nadu, Kerala, Karnataka, Andhra, Telangana)
  south_indian: {
    fat_loss: [
      { id: "sfl1", name: "Idli (2 pieces)", calories: 120, protein: 6, carbs: 25, fat: 1, region: "Tamil Nadu", benefits: ["Low fat", "Easily digestible"] },
      { id: "sfl2", name: "Dosa (1 piece, less oil)", calories: 150, protein: 5, carbs: 30, fat: 3, region: "Karnataka", benefits: ["Low calorie", "Fermented"] },
      { id: "sfl3", name: "Sambar (1 bowl)", calories: 100, protein: 5, carbs: 15, fat: 2, region: "Tamil Nadu", benefits: ["Protein rich", "Fiber rich"] },
      { id: "sfl4", name: "Rasam (1 bowl)", calories: 60, protein: 2, carbs: 10, fat: 1, region: "Tamil Nadu", benefits: ["Digestive aid", "Low calorie"] },
      { id: "sfl5", name: "Pongal (1 bowl)", calories: 200, protein: 8, carbs: 35, fat: 4, region: "Tamil Nadu", benefits: ["Easily digestible", "Energy rich"] },
      { id: "sfl6", name: "Avial (1 bowl)", calories: 150, protein: 5, carbs: 20, fat: 6, region: "Kerala", benefits: ["Vegetable rich", "Coconut benefits"] },
      { id: "sfl7", name: "Mor Kuzhambu (1 bowl)", calories: 120, protein: 6, carbs: 10, fat: 5, region: "Tamil Nadu", benefits: ["Probiotic", "Digestive aid"] },
      { id: "sfl8", name: "Tomato Rasam (1 bowl)", calories: 70, protein: 2, carbs: 12, fat: 1, region: "Karnataka", benefits: ["Low calorie", "Rich in lycopene"] },
      { id: "sfl9", name: "Kootu (1 bowl)", calories: 180, protein: 10, carbs: 25, fat: 5, region: "Tamil Nadu", benefits: ["Protein rich", "Fiber rich"] },
      { id: "sfl10", name: "Ragi Dosa (1 piece)", calories: 120, protein: 5, carbs: 20, fat: 2, region: "Karnataka", benefits: ["High calcium", "Gluten-free"] },
      { id: "sfl11", name: "Uttapam (1 piece, less oil)", calories: 150, protein: 6, carbs: 25, fat: 3, region: "Tamil Nadu", benefits: ["Protein rich", "Vegetable toppings"] },
      { id: "sfl12", name: "Pesarattu (1 piece)", calories: 180, protein: 8, carbs: 25, fat: 5, region: "Andhra", benefits: ["High protein", "Gluten-free"] },
      { id: "sfl13", name: "Kozhukattai (2 pieces)", calories: 120, protein: 3, carbs: 25, fat: 1, region: "Tamil Nadu", benefits: ["Steamed", "Low fat"] },
      { id: "sfl14", name: "Kambu Koozh (1 bowl)", calories: 150, protein: 6, carbs: 30, fat: 2, region: "Tamil Nadu", benefits: ["Probiotic", "High fiber"] },
      { id: "sfl15", name: "Kerala Red Rice (1 bowl)", calories: 200, protein: 5, carbs: 45, fat: 2, region: "Kerala", benefits: ["Low GI", "High fiber"] }
    ],
    muscle_gain: [
      { id: "smg1", name: "Chettinad Chicken (1 bowl)", calories: 450, protein: 40, carbs: 15, fat: 25, region: "Tamil Nadu", benefits: ["High protein", "Spice rich"] },
      { id: "smg2", name: "Fish Curry (1 bowl with 2 pieces)", calories: 400, protein: 45, carbs: 10, fat: 20, region: "Kerala", benefits: ["High protein", "Omega-3"] },
      { id: "smg3", name: "Mutton Sukka (1 bowl)", calories: 500, protein: 42, carbs: 12, fat: 35, region: "Karnataka", benefits: ["High protein", "Iron rich"] },
      { id: "smg4", name: "Chicken 65 (1 plate)", calories: 450, protein: 40, carbs: 20, fat: 25, region: "Andhra", benefits: ["High protein", "Spicy"] },
      { id: "smg5", name: "Prawn Masala (1 bowl)", calories: 400, protein: 45, carbs: 15, fat: 20, region: "Kerala", benefits: ["High protein", "Low fat"] },
      { id: "smg6", name: "Egg Curry (2 eggs with gravy)", calories: 350, protein: 26, carbs: 10, fat: 25, region: "Tamil Nadu", benefits: ["Complete protein", "Muscle building"] },
      { id: "smg7", name: "Kerala Beef Fry (1 plate)", calories: 500, protein: 45, carbs: 15, fat: 35, region: "Kerala", benefits: ["High protein", "Iron rich"] },
      { id: "smg8", name: "Andhra Chicken Curry (1 bowl)", calories: 480, protein: 42, carbs: 12, fat: 30, region: "Andhra", benefits: ["High protein", "Spicy"] },
      { id: "smg9", name: "Fish Molee (1 bowl)", calories: 420, protein: 40, carbs: 15, fat: 25, region: "Kerala", benefits: ["High protein", "Omega-3"] },
      { id: "smg10", name: "Mutton Chukka (1 bowl)", calories: 480, protein: 44, carbs: 10, fat: 32, region: "Tamil Nadu", benefits: ["High protein", "Iron rich"] },
      { id: "smg11", name: "Chicken Chettinad (1 bowl)", calories: 460, protein: 42, carbs: 15, fat: 28, region: "Tamil Nadu", benefits: ["High protein", "Spice rich"] },
      { id: "smg12", name: "Kerala Prawn Curry (1 bowl)", calories: 400, protein: 44, carbs: 12, fat: 22, region: "Kerala", benefits: ["High protein", "Low fat"] },
      { id: "smg13", name: "Kodi Vepudu (1 plate)", calories: 450, protein: 40, carbs: 15, fat: 28, region: "Andhra", benefits: ["High protein", "Spicy"] },
      { id: "smg14", name: "Nadan Beef Curry (1 bowl)", calories: 500, protein: 46, carbs: 12, fat: 35, region: "Kerala", benefits: ["High protein", "Iron rich"] },
      { id: "smg15", name: "Kozhi Varuval (1 plate)", calories: 480, protein: 44, carbs: 15, fat: 30, region: "Tamil Nadu", benefits: ["High protein", "Spicy"] }
    ]
  },

  // East Indian Cuisine (West Bengal, Odisha, Bihar, Jharkhand, Northeast)
  east_indian: {
    fat_loss: [
      { id: "efl1", name: "Macher Jhol (1 bowl with 1 piece fish)", calories: 200, protein: 25, carbs: 10, fat: 8, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "efl2", name: "Dalma (1 bowl)", calories: 180, protein: 10, carbs: 25, fat: 5, region: "Odisha", benefits: ["High fiber", "Plant protein"] },
      { id: "efl3", name: "Aloo Posto (1 bowl)", calories: 150, protein: 5, carbs: 20, fat: 6, region: "West Bengal", benefits: ["Low calorie", "High calcium"] },
      { id: "efl4", name: "Dahi Baingan (1 bowl)", calories: 120, protein: 5, carbs: 15, fat: 5, region: "Odisha", benefits: ["Low calorie", "Probiotic"] },
      { id: "efl5", name: "Chingri Macher Malai Curry (1 bowl, less oil)", calories: 250, protein: 25, carbs: 10, fat: 12, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "efl6", name: "Chenna Tarkari (1 bowl)", calories: 200, protein: 15, carbs: 15, fat: 8, region: "Odisha", benefits: ["High protein", "Calcium rich"] },
      { id: "efl7", name: "Aloo Bhaja (1 small bowl)", calories: 150, protein: 3, carbs: 20, fat: 7, region: "West Bengal", benefits: ["Vitamin C", "Potassium rich"] },
      { id: "efl8", name: "Macher Paturi (1 piece)", calories: 180, protein: 20, carbs: 5, fat: 10, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "efl9", name: "Dum Aloo (1 bowl, less oil)", calories: 200, protein: 5, carbs: 25, fat: 8, region: "Kashmir/Bengal", benefits: ["Vitamin C", "Low fat"] },
      { id: "efl10", name: "Doi Maach (1 bowl)", calories: 220, protein: 25, carbs: 8, fat: 10, region: "West Bengal", benefits: ["High protein", "Probiotic"] },
      { id: "efl11", name: "Chingri Macher Sorshe (1 bowl)", calories: 230, protein: 26, carbs: 8, fat: 12, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "efl12", name: "Macher Kalia (1 bowl)", calories: 240, protein: 28, carbs: 10, fat: 12, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "efl13", name: "Aloo Posto (1 bowl)", calories: 180, protein: 6, carbs: 20, fat: 8, region: "West Bengal", benefits: ["Calcium rich", "Low calorie"] },
      { id: "efl14", name: "Mochar Ghonto (1 bowl)", calories: 150, protein: 5, carbs: 25, fat: 4, region: "West Bengal", benefits: ["High fiber", "Low calorie"] },
      { id: "efl15", name: "Cholar Dal (1 bowl)", calories: 200, protein: 12, carbs: 30, fat: 5, region: "West Bengal", benefits: ["High protein", "Fiber rich"] }
    ],
    muscle_gain: [
      { id: "emg1", name: "Kosha Mangsho (1 bowl)", calories: 500, protein: 45, carbs: 15, fat: 35, region: "West Bengal", benefits: ["High protein", "Iron rich"] },
      { id: "emg2", name: "Macher Jhol (1 bowl with 2 pieces fish)", calories: 350, protein: 45, carbs: 15, fat: 18, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "emg3", name: "Chingri Malai Curry (1 bowl)", calories: 450, protein: 40, carbs: 20, fat: 28, region: "West Bengal", benefits: ["High protein", "Rich in iodine"] },
      { id: "emg4", name: "Mutton Curry (1 bowl)", calories: 500, protein: 48, carbs: 15, fat: 32, region: "Bihar", benefits: ["High protein", "Iron rich"] },
      { id: "emg5", name: "Chicken Rezala (1 bowl)", calories: 480, protein: 45, carbs: 15, fat: 30, region: "West Bengal", benefits: ["High protein", "Rich in spices"] },
      { id: "emg6", name: "Doi Maach (1 bowl)", calories: 400, protein: 42, carbs: 15, fat: 25, region: "West Bengal", benefits: ["High protein", "Probiotic"] },
      { id: "emg7", name: "Macher Paturi (2 pieces)", calories: 350, protein: 40, carbs: 10, fat: 20, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "emg8", name: "Kosha Mangsho (1 bowl)", calories: 520, protein: 46, carbs: 15, fat: 35, region: "West Bengal", benefits: ["High protein", "Iron rich"] },
      { id: "emg9", name: "Chingri Macher Malai Curry (1 bowl)", calories: 450, protein: 42, carbs: 15, fat: 30, region: "West Bengal", benefits: ["High protein", "Rich in iodine"] },
      { id: "emg10", name: "Mutton Rezala (1 bowl)", calories: 550, protein: 50, carbs: 15, fat: 38, region: "West Bengal", benefits: ["High protein", "Iron rich"] },
      { id: "emg11", name: "Chicken Dak Bungalow (1 bowl)", calories: 480, protein: 44, carbs: 15, fat: 30, region: "West Bengal", benefits: ["High protein", "Spice rich"] },
      { id: "emg12", name: "Macher Jhol (1 bowl with 3 pieces fish)", calories: 450, protein: 55, carbs: 15, fat: 25, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "emg13", name: "Kosha Mangsho with Luchi (1 plate)", calories: 650, protein: 48, carbs: 50, fat: 35, region: "West Bengal", benefits: ["High protein", "Energy dense"] },
      { id: "emg14", name: "Chingri Macher Sorshe (1 bowl)", calories: 420, protein: 45, carbs: 12, fat: 25, region: "West Bengal", benefits: ["High protein", "Omega-3"] },
      { id: "emg15", name: "Mutton Curry with Rice (1 plate)", calories: 600, protein: 50, carbs: 60, fat: 25, region: "Bihar", benefits: ["High protein", "Iron rich"] }
    ]
  },

  // West Indian Cuisine (Maharashtra, Gujarat, Goa)
  west_indian: {
    fat_loss: [
      { id: "wfl1", name: "Poha (1 plate)", calories: 250, protein: 8, carbs: 45, fat: 5, region: "Maharashtra", benefits: ["Light meal", "Iron rich"] },
      { id: "wfl2", name: "Khandvi (5 pieces)", calories: 150, protein: 8, carbs: 20, fat: 5, region: "Gujarat", benefits: ["High protein", "Low fat"] },
      { id: "wfl3", name: "Sol Kadhi (1 glass)", calories: 50, protein: 2, carbs: 10, fat: 1, region: "Goa", benefits: ["Digestive aid", "Probiotic"] },
      { id: "wfl4", name: "Thepla (2 pieces)", calories: 200, protein: 8, carbs: 30, fat: 5, region: "Gujarat", benefits: ["High fiber", "Protein rich"] },
      { id: "wfl5", name: "Pithla Bhakri (1 plate)", calories: 300, protein: 15, carbs: 45, fat: 8, region: "Maharashtra", benefits: ["High protein", "Gluten-free"] },
      { id: "wfl6", name: "Dahi Vada (2 pieces, low fat)", calories: 200, protein: 10, carbs: 30, fat: 5, region: "Gujarat", benefits: ["Probiotic", "Protein rich"] },
      { id: "wfl7", name: "Sabudana Khichdi (1 bowl)", calories: 250, protein: 3, carbs: 50, fat: 5, region: "Maharashtra", benefits: ["Easily digestible", "Energy rich"] },
      { id: "wfl8", name: "Kothimbir Vadi (2 pieces)", calories: 150, protein: 6, carbs: 20, fat: 5, region: "Maharashtra", benefits: ["High fiber", "Antioxidants"] },
      { id: "wfl9", name: "Dudhi Chana (1 bowl)", calories: 200, protein: 12, carbs: 25, fat: 6, region: "Gujarat", benefits: ["High protein", "Fiber rich"] },
      { id: "wfl10", name: "Masala Bhaat (1 bowl)", calories: 250, protein: 8, carbs: 40, fat: 6, region: "Maharashtra", benefits: ["Vegetable rich", "Fiber rich"] },
      { id: "wfl11", name: "Methi Thepla (2 pieces)", calories: 200, protein: 8, carbs: 30, fat: 5, region: "Gujarat", benefits: ["Iron rich", "High fiber"] },
      { id: "wfl12", name: "Puran Poli (1 piece)", calories: 200, protein: 5, carbs: 40, fat: 4, region: "Maharashtra", benefits: ["Energy rich", "Protein rich"] },
      { id: "wfl13", name: "Kadhi (1 bowl)", calories: 150, protein: 8, carbs: 20, fat: 5, region: "Gujarat", benefits: ["Probiotic", "Protein rich"] },
      { id: "wfl14", name: "Bharli Vangi (1 bowl)", calories: 180, protein: 6, carbs: 25, fat: 7, region: "Maharashtra", benefits: ["High fiber", "Low calorie"] },
      { id: "wfl15", name: "Khandvi (6 pieces)", calories: 180, protein: 10, carbs: 25, fat: 6, region: "Gujarat", benefits: ["High protein", "Low fat"] }
    ],
    muscle_gain: [
      { id: "wmg1", name: "Prawn Balchao (1 bowl)", calories: 450, protein: 42, carbs: 15, fat: 28, region: "Goa", benefits: ["High protein", "Omega-3"] },
      { id: "wmg2", name: "Chicken Kolhapuri (1 bowl)", calories: 480, protein: 45, carbs: 15, fat: 30, region: "Maharashtra", benefits: ["High protein", "Spicy"] },
      { id: "wmg3", name: "Mutton Sukka (1 bowl)", calories: 500, protein: 46, carbs: 12, fat: 35, region: "Maharashtra", benefits: ["High protein", "Iron rich"] },
      { id: "wmg4", name: "Goan Fish Curry (1 bowl with 2 pieces)", calories: 420, protein: 45, carbs: 15, fat: 25, region: "Goa", benefits: ["High protein", "Omega-3"] },
      { id: "wmg5", name: "Chicken Xacuti (1 bowl)", calories: 480, protein: 44, carbs: 15, fat: 30, region: "Goa", benefits: ["High protein", "Spice rich"] },
      { id: "wmg6", name: "Mutton Rassa (1 bowl)", calories: 520, protein: 48, carbs: 15, fat: 35, region: "Maharashtra", benefits: ["High protein", "Iron rich"] },
      { id: "wmg7", name: "Prawn Xeque (1 bowl)", calories: 450, protein: 44, carbs: 15, fat: 28, region: "Goa", benefits: ["High protein", "Omega-3"] },
      { id: "wmg8", name: "Chicken Cafreal (1 plate)", calories: 480, protein: 45, carbs: 15, fat: 30, region: "Goa", benefits: ["High protein", "Herb rich"] },
      { id: "wmg9", name: "Mutton Kolhapuri (1 bowl)", calories: 520, protein: 48, carbs: 15, fat: 35, region: "Maharashtra", benefits: ["High protein", "Iron rich"] },
      { id: "wmg10", name: "Goan Sausage Pulao (1 plate)", calories: 550, protein: 30, carbs: 60, fat: 25, region: "Goa", benefits: ["High protein", "Energy dense"] },
      { id: "wmg11", name: "Chicken Sukka (1 bowl)", calories: 480, protein: 45, carbs: 15, fat: 30, region: "Maharashtra", benefits: ["High protein", "Spice rich"] },
      { id: "wmg12", name: "Prawn Balchao with Rice (1 plate)", calories: 500, protein: 45, carbs: 50, fat: 20, region: "Goa", benefits: ["High protein", "Omega-3"] },
      { id: "wmg13", name: "Mutton Masala (1 bowl)", calories: 520, protein: 48, carbs: 15, fat: 35, region: "Maharashtra", benefits: ["High protein", "Iron rich"] },
      { id: "wmg14", name: "Chicken Xacuti with Pulao (1 plate)", calories: 580, protein: 48, carbs: 55, fat: 25, region: "Goa", benefits: ["High protein", "Energy dense"] },
      { id: "wmg15", name: "Mutton Rassa with Bhakri (1 plate)", calories: 600, protein: 50, carbs: 45, fat: 35, region: "Maharashtra", benefits: ["High protein", "Iron rich"] }
    ]
  },

  // Northeast Indian Cuisine
  northeast_indian: {
    fat_loss: [
      { id: "nefl1", name: "Thukpa (1 bowl, clear soup)", calories: 200, protein: 12, carbs: 25, fat: 5, region: "Sikkim", benefits: ["High protein", "Hydrating"] },
      { id: "nefl2", name: "Bamboo Shoot Fry (1 bowl)", calories: 120, protein: 5, carbs: 15, fat: 5, region: "Nagaland", benefits: ["High fiber", "Low calorie"] },
      { id: "nefl3", name: "Khar (1 bowl)", calories: 150, protein: 8, carbs: 20, fat: 5, region: "Assam", benefits: ["Digestive aid", "Alkaline food"] },
      { id: "nefl4", name: "Masor Tenga (1 bowl)", calories: 180, protein: 20, carbs: 10, fat: 8, region: "Assam", benefits: ["High protein", "Omega-3"] },
      { id: "nefl5", name: "Kelli Chana (1 bowl)", calories: 200, protein: 12, carbs: 25, fat: 5, region: "Meghalaya", benefits: ["High protein", "Fiber rich"] },
      { id: "nefl6", name: "Bamboo Shoot Curry (1 bowl)", calories: 150, protein: 8, carbs: 15, fat: 6, region: "Arunachal", benefits: ["High fiber", "Low calorie"] },
      { id: "nefl7", name: "Alu Pitika (1 bowl)", calories: 180, protein: 5, carbs: 25, fat: 5, region: "Assam", benefits: ["High fiber", "Low fat"] },
      { id: "nefl8", name: "Jadoh (1 bowl, less oil)", calories: 250, protein: 10, carbs: 40, fat: 6, region: "Meghalaya", benefits: ["High energy", "Protein rich"] },
      { id: "nefl9", name: "Misa Mach Poora (1 piece)", calories: 200, protein: 25, carbs: 5, fat: 10, region: "Mizoram", benefits: ["High protein", "Omega-3"] },
      { id: "nefl10", name: "Chamthong (1 bowl)", calories: 150, protein: 10, carbs: 20, fat: 4, region: "Manipur", benefits: ["Light meal", "Nutrient dense"] },
      { id: "nefl11", name: "Bai (1 bowl)", calories: 180, protein: 8, carbs: 25, fat: 5, region: "Mizoram", benefits: ["Vegetable rich", "High fiber"] },
      { id: "nefl12", name: "Pork with Bamboo Shoot (1 bowl)", calories: 300, protein: 25, carbs: 15, fat: 18, region: "Nagaland", benefits: ["High protein", "Rich in collagen"] },
      { id: "nefl13", name: "Chicken with Black Sesame (1 bowl)", calories: 280, protein: 30, carbs: 10, fat: 15, region: "Arunachal", benefits: ["High protein", "Calcium rich"] },
      { id: "nefl14", name: "Fish Tenga (1 bowl)", calories: 200, protein: 22, carbs: 8, fat: 10, region: "Assam", benefits: ["High protein", "Omega-3"] },
      { id: "nefl15", name: "Khar (1 bowl)", calories: 160, protein: 8, carbs: 20, fat: 6, region: "Assam", benefits: ["Digestive aid", "Alkaline"] }
    ],
    muscle_gain: [
      { id: "nemg1", name: "Pork with Bamboo Shoot (1 bowl)", calories: 450, protein: 40, carbs: 15, fat: 30, region: "Nagaland", benefits: ["High protein", "Rich in collagen"] },
      { id: "nemg2", name: "Smoked Pork with Akhuni (1 bowl)", calories: 500, protein: 45, carbs: 20, fat: 35, region: "Nagaland", benefits: ["High protein", "Iron rich"] },
      { id: "nemg3", name: "Duck with Ash Gourd (1 bowl)", calories: 480, protein: 42, carbs: 15, fat: 32, region: "Assam", benefits: ["High protein", "Rich in iron"] },
      { id: "nemg4", name: "Pork Vindaloo (1 bowl)", calories: 520, protein: 45, carbs: 20, fat: 35, region: "Goa/NE", benefits: ["High protein", "Spicy"] },
      { id: "nemg5", name: "Chicken with Black Sesame (1 bowl)", calories: 450, protein: 42, carbs: 15, fat: 28, region: "Arunachal", benefits: ["High protein", "Calcium rich"] },
      { id: "nemg6", name: "Beef with Bamboo Shoot (1 bowl)", calories: 480, protein: 46, carbs: 15, fat: 32, region: "Nagaland", benefits: ["High protein", "Iron rich"] },
      { id: "nemg7", name: "Fish Stew (1 bowl)", calories: 400, protein: 45, carbs: 15, fat: 25, region: "Assam", benefits: ["High protein", "Omega-3"] },
      { id: "nemg8", name: "Pork with Mustard Greens (1 bowl)", calories: 480, protein: 44, carbs: 15, fat: 32, region: "Manipur", benefits: ["High protein", "Iron rich"] },
      { id: "nemg9", name: "Smoked Meat Curry (1 bowl)", calories: 500, protein: 46, carbs: 15, fat: 35, region: "Nagaland", benefits: ["High protein", "Rich in iron"] },
      { id: "nemg10", name: "Chicken with Local Herbs (1 bowl)", calories: 450, protein: 42, carbs: 15, fat: 28, region: "Mizoram", benefits: ["High protein", "Antioxidant rich"] },
      { id: "nemg11", name: "Pork with Akhuni (1 bowl)", calories: 520, protein: 45, carbs: 15, fat: 36, region: "Nagaland", benefits: ["High protein", "Rich in collagen"] },
      { id: "nemg12", name: "Beef with Bamboo Shoot (1 bowl)", calories: 500, protein: 46, carbs: 15, fat: 34, region: "Nagaland", benefits: ["High protein", "Iron rich"] },
      { id: "nemg13", name: "Duck with Local Herbs (1 bowl)", calories: 480, protein: 44, carbs: 15, fat: 32, region: "Assam", benefits: ["High protein", "Iron rich"] },
      { id: "nemg14", name: "Pork with Mustard (1 bowl)", calories: 500, protein: 45, carbs: 15, fat: 35, region: "Manipur", benefits: ["High protein", "Iron rich"] },
      { id: "nemg15", name: "Chicken with Local Herbs (1 bowl)", calories: 450, protein: 42, carbs: 15, fat: 28, region: "Mizoram", benefits: ["High protein", "Antioxidant rich"] }
    ]
  },

  // Street Food & Snacks
  street_food: {
    fat_loss: [
      { id: "sfl1", name: "Sprouts Chaat (1 plate)", calories: 150, protein: 10, carbs: 20, fat: 4, region: "All India", benefits: ["High protein", "Fiber rich"] },
      { id: "sfl2", name: "Fruit Chaat (1 plate)", calories: 120, protein: 2, carbs: 25, fat: 1, region: "All India", benefits: ["Vitamin rich", "Low calorie"] },
      { id: "sfl3", name: "Roasted Makhana (1 bowl)", calories: 100, protein: 4, carbs: 15, fat: 3, region: "Bihar", benefits: ["Low calorie", "High fiber"] },
      { id: "sfl4", name: "Corn on the Cob (1 piece)", calories: 120, protein: 4, carbs: 25, fat: 2, region: "All India", benefits: ["High fiber", "Low fat"] },
      { id: "sfl5", name: "Roasted Sweet Potato (1 piece)", calories: 150, protein: 3, carbs: 35, fat: 0, region: "All India", benefits: ["Vitamin A rich", "Low fat"] },
      { id: "sfl6", name: "Mung Bean Chilla (1 piece)", calories: 120, protein: 8, carbs: 15, fat: 3, region: "North India", benefits: ["High protein", "Low fat"] },
      { id: "sfl7", name: "Roasted Chana (1 bowl)", calories: 150, protein: 10, carbs: 20, fat: 4, region: "All India", benefits: ["High protein", "Fiber rich"] },
      { id: "sfl8", name: "Vegetable Poha (1 plate)", calories: 250, protein: 8, carbs: 45, fat: 5, region: "Maharashtra", benefits: ["Iron rich", "Light meal"] },
      { id: "sfl9", name: "Idli (2 pieces)", calories: 120, protein: 6, carbs: 25, fat: 1, region: "South India", benefits: ["Low fat", "Easily digestible"] },
      { id: "sfl10", name: "Dahi Vada (2 pieces, low fat)", calories: 200, protein: 10, carbs: 30, fat: 5, region: "North India", benefits: ["Probiotic", "Protein rich"] }
    ],
    muscle_gain: [
      { id: "smg1", name: "Egg Roll (1 roll)", calories: 350, protein: 20, carbs: 30, fat: 15, region: "Kolkata", benefits: ["High protein", "Energy dense"] },
      { id: "smg2", name: "Chicken Shawarma (1 roll)", calories: 400, protein: 35, carbs: 30, fat: 20, region: "All India", benefits: ["High protein", "Balanced meal"] },
      { id: "smg3", name: "Kathi Roll (1 roll)", calories: 380, protein: 25, carbs: 35, fat: 18, region: "Kolkata", benefits: ["High protein", "Energy rich"] },
      { id: "smg4", name: "Keema Pav (1 plate)", calories: 450, protein: 30, carbs: 40, fat: 25, region: "Mumbai", benefits: ["High protein", "Iron rich"] },
      { id: "smg5", name: "Chicken Lollipop (5 pieces)", calories: 400, protein: 35, carbs: 20, fat: 22, region: "Kolkata", benefits: ["High protein", "Low carb"] },
      { id: "smg6", name: "Egg Bhurji Pav (1 plate)", calories: 450, protein: 30, carbs: 40, fat: 25, region: "Mumbai", benefits: ["High protein", "Complete meal"] },
      { id: "smg7", name: "Chicken 65 (1 plate)", calories: 450, protein: 40, carbs: 20, fat: 25, region: "Andhra", benefits: ["High protein", "Spicy"] },
      { id: "smg8", name: "Mutton Kebab (4 pieces)", calories: 400, protein: 35, carbs: 10, fat: 28, region: "Lucknow", benefits: ["High protein", "Iron rich"] },
      { id: "smg9", name: "Fish Fry (2 pieces)", calories: 350, protein: 40, carbs: 15, fat: 20, region: "Kerala", benefits: ["High protein", "Omega-3"] },
      { id: "smg10", name: "Butter Chicken with Naan (1 plate)", calories: 600, protein: 45, carbs: 60, fat: 30, region: "Punjab", benefits: ["High protein", "Energy dense"] }
    ]
  }
};

// Function to get all foods from all regions and categories
export const getAllIndianFoods = () => {
  const allFoods = [];
  
  // Helper function to add foods from a category
  const addFoods = (category) => {
    Object.values(category).forEach(foodArray => {
      if (Array.isArray(foodArray)) {
        allFoods.push(...foodArray);
      }
    });
  };
  
  // Add foods from each region
  Object.values(INDIAN_FOOD_DATABASE).forEach(region => {
    addFoods(region);
  });
  
  return allFoods;
};

// Function to get foods by region
export const getFoodsByRegion = (region) => {
  const regionData = INDIAN_FOOD_DATABASE[region];
  if (!regionData) return [];
  
  const foods = [];
  Object.values(regionData).forEach(category => {
    foods.push(...category);
  });
  
  return foods;
};

// Function to get foods by category (fat_loss, muscle_gain, balanced)
export const getFoodsByCategory = (category) => {
  const foods = [];
  
  Object.values(INDIAN_FOOD_DATABASE).forEach(region => {
    if (region[category]) {
      foods.push(...region[category]);
    }
  });
  
  return foods;
};

// Function to search foods by name, region, or benefits
export const searchFoods = (query) => {
  const searchTerm = query.toLowerCase();
  const allFoods = getAllIndianFoods();
  
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm) ||
    food.region.toLowerCase().includes(searchTerm) ||
    food.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm))
  );
};
