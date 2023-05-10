const mongoose = require('mongoose')

const nameSchema = mongoose.Schema({
  prefix: {
    type: String,
  },
  first_name: {
    type: String,
  },
  middle_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
})

const documentSchema = mongoose.Schema({
	title: {
		type: String,
	},
	abstract: {
		type: String,
	},
	keywords: {
		type: Array,
	},
})

const thesis_project = mongoose.Schema(
	{
		thai: {
			document: documentSchema,
			advisor: [nameSchema],
			author: [nameSchema],
		},
		eng: {
			document: documentSchema,
			advisor: [nameSchema],
			author: [nameSchema],
		},
		// document_title_en: {
		//   type: String,
		// },
		// document_title_th: {
		//   type: String,
		// },
		// document_abstract_en: {
		//   type: String,
		// },
		// document_abstract_th: {
		//   type: String,
		// },
		// keywords_en: {
		//   type: String,
		// },
		// keywords_th: {
		//   type: String,
		// },
		// academic_year: {
		//   type: String,
		// },
		// author_prefix_en: {
		//   type: String,
		// },
		// author_firstname_en: {
		//   type: String,
		// },
		// author_middlename_en: {
		//   type: String,
		// },
		// author_lastname_en: {
		//   type: String,
		// },
		// author_prefix_en_2: {
		//   type: String,
		// },
		// author_firstname_en_2: {
		//   type: String,
		// },
		// author_middlename_en_2: {
		//   type: String,
		// },
		// author_lastname_en_2: {
		//   type: String,
		// },
		// author_prefix_en_3: {
		//   type: String,
		// },
		// author_firstname_en_3: {
		//   type: String,
		// },
		// author_middlename_en_3: {
		//   type: String,
		// },
		// author_lastname_en_3: {
		//   type: String,
		// },
		// author_prefix_th: {
		//   type: String,
		// },
		// author_firstname_th: {
		//   type: String,
		// },
		// author_middlename_th: {
		//   type: String,
		// },
		// author_lastname_th: {
		//   type: String,
		// },
		// author_prefix_th_2: {
		//   type: String,
		// },
		// author_firstname_th_2: {
		//   type: String,
		// },
		// author_middlename_th_2: {
		//   type: String,
		// },
		// author_lastname_th_2: {
		//   type: String,
		// },
		// author_prefix_th_3: {
		//   type: String,
		// },
		// author_firstname_th_3: {
		//   type: String,
		// },
		// author_middlename_th_3: {
		//   type: String,
		// },
		// author_lastname_th_3: {
		//   type: String,
		// },
		// advisor_prefix_en: {
		//   type: String,
		// },
		// advisor_firstname_en: {
		//   type: String,
		// },
		// advisor_middlename_en: {
		//   type: String,
		// },
		// advisor_lastname_en: {
		//   type: String,
		// },
		// advisor_prefix_en_2: {
		//   type: String,
		// },
		// advisor_firstname_en_2: {
		//   type: String,
		// },
		// advisor_middlename_en_2: {
		//   type: String,
		// },
		// advisor_lastname_en_2: {
		//   type: String,
		// },
		// advisor_prefix_th: {
		//   type: String,
		// },
		// advisor_firstname_th: {
		//   type: String,
		// },
		// advisor_middlename_th: {
		//   type: String,
		// },
		// advisor_lastname_th: {
		//   type: String,
		// },
		// advisor_prefix_th_2: {
		//   type: String,
		// },
		// advisor_firstname_th_2: {
		//   type: String,
		// },
		// advisor_middlename_th_2: {
		//   type: String,
		// },
		// advisor_lastname_th_2: {
		//   type: String,
		// },
		advisor_id: {
			type: Array,
		},
		degree: {
			type: String,
		},
		academic_year: {
			type: String,
		},
		project_type: {
			type: String,
		},
		document_path: {
			type: String,
			required: false,
		},
		file_name: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	}
)

module.exports = mongoose.model('thesis_project', thesis_project)
