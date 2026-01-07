const courses = require('../../data/courses');

function listCourses(req, res) {
  // used by pages
  const catalog = [
    { key: 'english', title: 'English Basic Course', desc: 'คอร์สอังกฤษพื้นฐาน + แบบทดสอบ', icon: '🇬🇧' },
    { key: 'coding', title: 'Python Master Class', desc: 'ทบทวน Python Phase 1-2 พร้อม quiz', icon: '🐍' },
    { key: 'playground', title: 'Python Playground', desc: 'ทดลองเขียน Python แบบอินเทอร์แอคทีฟ', icon: '🧪' },
  ];
  res.json({ success: true, catalog });
}

function getCourse(req, res) {
  const { category } = req.params;
  if (category === 'playground') {
    return res.json({ success: true, category, episodes: [], playground: true });
  }
  const episodes = courses[category];
  if (!episodes) return res.status(404).json({ success: false, msg: 'ไม่พบคอร์ส' });
  return res.json({ success: true, category, episodes });
}

module.exports = { listCourses, getCourse };
