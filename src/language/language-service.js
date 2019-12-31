const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },
  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  getTranslation(db, word_id) {
    return db
      .from('word')
      .select('translation', 'memory_value', 'correct_count', 'incorrect_count')
      .where({ id: word_id });
  },
  correctAnswer(db, word) {
    return db
      .from('word')
      .update({
        memory_value: word.memory_value * 2,
        correct_count: word.correct_count + 1,
      })
      .where({ id: word.id });
  },
  incorrectAnswer(db, word) {
    return db
      .from('word')
      .update({
        memory_value: 1,
        incorrect_count: word.incorrect_count + 1,
      })
      .where({ id: word.id });
  },
  updateTotalScore(db, language) {
    return db
      .from('language')
      .update({
        total_score: language.total_score + 1,
      })
      .where({ id: language.id });
  },
};

module.exports = LanguageService;
