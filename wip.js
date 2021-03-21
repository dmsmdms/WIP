'use strict';

class WIP {
    constructor(submit_callback, error_callback) {
        const this_class = this;

        this.data = new Array();
        this.image = new Image();
        this.error_callback = error_callback;
        this.submit_callback = submit_callback;
        this.canvas = document.createElement('canvas');
        this.canvas_ctx = this.canvas.getContext('2d');

        this.dialog = this.create_dialog();
        this.form = document.querySelector('.wip-form');
        this.input_button = document.querySelector('.wip-input-button');
        this.preview = document.querySelector('.wip-preview');

        if (this.input_button != undefined && this.preview != undefined) {
            this.input_button.onchange = function() {
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    const blob = new Blob([file], { type: file.type });

                    const data = new Object({
                        blob: blob, new_blob: blob, name: file.name, position_x: 0, position_y: 0,
                        width: 1, height: 1, size: 1, quality: 1, type: file.type, background: '#fff',
                    });
                    
                    data.preview = this_class.create_preview(data);
                    this_class.data.push(data);
                }

                // Clear FileList //
                this.value = '';
            }
        }

        if (this.form != undefined) {
            this.form.onsubmit = function () {
                const form_data = new FormData(this);
                const xml_http_request = new XMLHttpRequest();

                xml_http_request.open(this.method, this.action, true);
                const name = this_class.input_button.name + '[]';

                this_class.data.forEach(function (data) {
                    form_data.append(name, data.new_blob, this_class.get_file_name(data));
                });

                xml_http_request.onload = function () {
                    if (xml_http_request.status == 200 && this_class.submit_callback != undefined) {
                        this_class.submit_callback(xml_http_request.response);
                    } else if (this_class.error_callback != undefined) {
                        this_class.error_callback(xml_http_request.status);
                    }
                }

                xml_http_request.send(form_data);
                return false;
            }
        }
    }

    create_element(class_name, parent, element) {
        const div = document.createElement(element);
        div.classList.add(class_name);
        parent.appendChild(div);
        return div;
    }

    create_div(class_name, parent) {
        return this.create_element(class_name, parent, 'div');
    }

    create_img(class_name, parent) {
        return this.create_element(class_name, parent, 'img');
    }

    create_button(class_name, parent) {
        return this.create_element(class_name, parent, 'button');
    }

    create_select(class_name, parent) {
        return this.create_element(class_name, parent, 'select');
    }

    create_label(class_name, parent, name, text) {
        const label = this.create_element(class_name, parent, 'label');
        label.innerText = text;
        label.for = name;
        return label;
    }

    create_input(class_name, parent, name) {
        const input = this.create_element(class_name, parent, 'input');
        input.name = name;
        return input;
    }

    create_option(class_name, parent, text, value) {
        const option = this.create_element(class_name, parent, 'option');
        option.innerText = text;
        option.value = value;
        return option;
    }

    create_dialog_block(name, parent, text, class_name) {
        const options_block = this.create_div(class_name, parent);
        this.create_label('wip-dialog-option-lebel', options_block, name, text);

        const input = this.create_input('wip-dialog-option-input', options_block, name);
        input.type = 'number';
        return input;
    }

    create_dialog_option(name, parent, text, is_disabled = false) {
        const input = this.create_dialog_block(name, parent, text, 'wip-dialog-option-block');
        input.disabled = is_disabled;
        return input;
    }

    create_dialog_range(name, parent, text) {
        return this.create_dialog_block(name, parent, text, 'wip-dialog-option-range-block');
    }

    create_dialog_select(name, parent, text) {
        const select_block = this.create_div('wip-dialog-option-select-block', parent);
        this.create_label('wip-dialog-option-lebel', select_block, name, text);
        return this.create_select('wip-dialog-option-select', select_block);
    }

    create_option_type(parent, text, value) {
        this.create_option('wip-dialog-option-type', parent, text, value);
    }

    add_input_range(input, name) {
        const range = this.create_input('wip-dialog-option-range', input.parentElement, name);
        range.type = 'range';
        return range;
    }

    set_range_min_max(input, range, min, max) {
        input.min = range.min = min;
        input.max = range.max = max;
    }

    create_border(parent, cursor) {
        const border = this.create_div('wip-dialog-edit-border', parent);
        border.style.cursor = cursor;
        return border;
    }

    create_image_borders(parent) {
        const borders = new Array();

        borders[0] = this.create_border(parent, 'nw-resize');
        borders[1] = this.create_border(parent, 'n-resize');
        borders[2] = this.create_border(parent, 'ne-resize');
        borders[3] = this.create_border(parent, 'e-resize');
        borders[4] = this.create_border(parent, 'se-resize');
        borders[5] = this.create_border(parent, 's-resize');
        borders[6] = this.create_border(parent, 'sw-resize');
        borders[7] = this.create_border(parent, 'w-resize');

        return borders;
    }

    create_block(parent) {
        return this.create_div('wip-dialog-edit-border-block', parent);
    }

    create_blocks(parent) {
        const blocks = new Array();

        blocks[0] = this.create_block(parent);
        blocks[1] = this.create_block(parent);
        blocks[2] = this.create_block(parent);
        blocks[3] = this.create_block(parent);

        return blocks;
    }

    create_dialog() {
        const dialog = this.create_element('wip-dialog', document.body, 'dialog');
        const dialog_edit = this.create_div('wip-dialog-edit', dialog);
        const dialog_options = this.create_div('wip-dialog-options', dialog);

        this.dialog_loading = this.create_div('wip-dialog-loading', dialog);
        const loading_wrapper = this.create_div('wip-dialog-loading-wrapper', this.dialog_loading);

        this.create_div('wip-dialog-loading-div-1', loading_wrapper);
        this.create_div('wip-dialog-loading-div-2', loading_wrapper);
        this.create_div('wip-dialog-loading-div-3', loading_wrapper);
        this.create_div('wip-dialog-loading-div-4', loading_wrapper);

        const loading_title = this.create_div('wip-dialog-loading-title', loading_wrapper);
        loading_title.innerText = 'LOADING';

        this.edit_block = this.create_div('wip-dialog-edit-block', dialog_edit);
        this.canvas_image = this.create_img('wip-dialog-edit-img', this.edit_block);

        this.blocks = this.create_blocks(this.edit_block);
        this.borders = this.create_image_borders(this.edit_block);
        
        const options_header = this.create_div('wip-dialog-options-header', dialog_options);
        this.dialog_name = this.create_div('wip-dialog-option-name', options_header);

        this.dialog_close = this.create_button('wip-dialog-option-close', options_header);
        const close_icon = this.create_div('wip-dialog-option-close-icon', this.dialog_close);
        close_icon.innerText = '+';

        const options_title = this.create_div('wip-dialog-options-title', dialog_options);
        options_title.innerText = 'OPTIONS';

        this.position_x = this.create_dialog_option('position-x', dialog_options, 'Position X (px)');
        this.position_x.min = 0;

        this.position_y = this.create_dialog_option('position-y', dialog_options, 'Position Y (px)');
        this.position_y.min = 0;

        this.width = this.create_dialog_option('width', dialog_options, 'Width (px)');
        this.width.min = 1;

        this.height = this.create_dialog_option('height', dialog_options, 'Height (px)');
        this.height.min = 1;

        this.size = this.create_dialog_range('size', dialog_options, 'Size (%)');
        this.size_range = this.add_input_range(this.size, 'size_range');
        this.set_range_min_max(this.size, this.size_range, 1, 100);

        this.quality = this.create_dialog_range('quality', dialog_options, 'Quality (%)');
        this.quality_range = this.add_input_range(this.quality, 'quality_range');
        this.set_range_min_max(this.quality, this.quality_range, 1, 100);

        this.scale = this.create_dialog_range('scale', dialog_options, 'Scale (%)');
        this.scale_range = this.add_input_range(this.scale, 'scale_range');
        this.set_range_min_max(this.scale, this.scale_range, 1, 100);

        this.natural_size = this.create_dialog_option('natural-size', dialog_options, 'Natural size (Kb)', true);
        this.processed_size = this.create_dialog_option('processed-size', dialog_options, 'Processed size (Kb)', true);

        this.type = this.create_dialog_select('type', dialog_options, 'Image type');
        this.create_option_type(this.type, 'JPEG', 'image/jpeg');
        this.create_option_type(this.type, 'PNG',  'image/png');
        this.create_option_type(this.type, 'WebP', 'image/webp');

        return dialog;
    }

    get_file_name(data) {
        let name = data.name.split('.')[0];

        switch(data.type) {
            case 'image/jpeg':
                name += '.jpg';
            break;
            case 'image/png':
                name += '.png';
            break;
            case 'image/webp':
                name += '.webp';
            break;
        }

        return name;
    }

    create_preview(data) {
        const this_class = this;
        const url = URL.createObjectURL(data.blob);

        const preview_item = document.createElement('div');
        preview_item.classList.add('wip-preview-item');

        const item_delete = this.create_div('wip-preview-item-delete', preview_item);
        const item_title = this.create_div('wip-preview-item-title', preview_item);
        const item_background = this.create_div('wip-preview-item-background', preview_item);
        const item_img = this.create_img('wip-preview-item-img', item_background);
        const item_hover = this.create_div('wip-preview-item-hover', item_background);
        const item_download = this.create_element('wip-preview-item-download', preview_item, 'a');

        item_img.src = url;
        item_delete.innerText = '+';
        item_hover.innerText = 'EDIT';
        item_title.innerText = data.name;
        item_download.innerText = 'DOWNLOAD';
        item_download.disabled = true;
        data.item_download = item_download;

        item_download.onmousedown = function () {
            if (data.new_blob != undefined) {
                this.href = URL.createObjectURL(data.new_blob);
                this.download = this_class.get_file_name(data);
            }
        }

        item_download.onmouseup = function () {
            if (data.new_blob != undefined) {
                //window.URL.revokeObjectURL(this.href); 
            }
        }
        
        item_title.onclick = item_hover.onclick = function () {
            this_class.edit_image(data);
        }
        
        item_delete.onclick = function () {
            const index = this_class.data.indexOf(data);
            this_class.data.splice(index, 1);
            data.preview.remove();
        }

        item_img.onload = function () {
            URL.revokeObjectURL(url);

            const k_width = 0.615 * window.innerWidth / this.naturalWidth;
            const k_height = 0.84 * window.innerHeight / this.naturalHeight;

            const min_k = Math.min(k_width, k_height);
            data.k_wh = k_width / k_height;

            data.min_scale = min_k / 100;
            data.scale = data.max_scale = min_k;

            this_class.preview.appendChild(preview_item);
        }

        return preview_item;
    }

    set_border_position(id, x, y) {
        this.borders[id].style.left = 100 * x + '%';
        this.borders[id].style.top = 100 * y + '%';
    }

    set_block_position(id, x, y, width, height) {
        this.blocks[id].style.height = 100 * height + '%';
        this.blocks[id].style.width = 100 * width + '%';
        this.blocks[id].style.left = 100 * x + '%';
        this.blocks[id].style.top = 100 * y + '%';
    }

    set_borders(position_x, position_y, width, height) {
        const half_x = position_x + 0.5 * width;
        const half_y = position_y + 0.5 * height;
        const max_x = position_x + width;
        const max_y = position_y + height;

        this.set_border_position(0, position_x, position_y);
        this.set_border_position(1, half_x, position_y);
        this.set_border_position(2, max_x, position_y);
        this.set_border_position(3, max_x, half_y);
        this.set_border_position(4, max_x, max_y);
        this.set_border_position(5, half_x, max_y);
        this.set_border_position(6, position_x, max_y);
        this.set_border_position(7, position_x, half_y);

        this.set_block_position(0, 0, 0, position_x, 1);
        this.set_block_position(1, position_x, 0, width, position_y);
        this.set_block_position(2, max_x, 0, 1 - max_x, 1);
        this.set_block_position(3, position_x, max_y, width, 1 - max_y);
    }

    set_options(data, callback) {
        const width = data.size * this.image.naturalWidth;
        const height = data.size * this.image.naturalHeight;

        const real_width = Math.round(data.width * width);
        this.width.value = real_width;
        this.width.max = width;

        const real_height = Math.round(data.height * height);
        this.height.value = real_height;
        this.height.max = height;

        const position_x = Math.round(data.position_x * width);
        this.position_x.value = position_x;
        this.position_x.max = width - 1;

        const position_y = Math.round(data.position_y * width);
        this.position_y.value = position_y;
        this.position_y.max = height - 1;

        this.set_borders(data.position_x, data.position_y, data.width, data.height);

        if (callback == undefined) {
            return;
        }

        this.size.value = this.size_range.value = Math.round(data.size * 100);
        this.scale.value = this.scale_range.value = Math.round(data.scale * 100 / data.max_scale);
        this.type.value = data.type;

        this.canvas.width = width;
        this.canvas.height = height;

        if (data.type == 'image/jpeg' || data.type == 'image/webp') {
            this.quality.value = this.quality_range.value = Math.round(data.quality * 100);
            this.quality.disabled = this.quality_range.disabled = false;

            if (data.type == 'image/jpeg') {
                this.canvas_ctx.fillStyle = data.background;
                this.canvas_ctx.fillRect(0, 0, width, height);
            }
        } else {
            this.quality.value = this.quality_range.value = 100;
            this.quality.disabled = this.quality_range.disabled = true;
        }

        const this_class = this;
        this.canvas_ctx.drawImage(this.image, 0, 0, width, height);

        this.canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            this_class.canvas_image.src = url;

            this_class.canvas_image.onload = function () {
                URL.revokeObjectURL(url);
                callback();
            };

            this_class.canvas.width = real_width;
            this_class.canvas.height = real_height;
            this_class.canvas_ctx.drawImage(this_class.image, position_x, position_y, real_width,
                real_height, 0, 0, real_width, real_height);

            this_class.canvas.toBlob(function (blob) {
                this_class.processed_size.value = Math.round(blob.size / 1024);
                data.item_download.disabled = false;
                data.new_blob = blob;
            }, data.type, data.quality);
        }, data.type, data.quality);
    }

    change_position_x(data) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        const width = data.size * this.image.naturalWidth;
        const position_x = Math.max(0, Math.min(parseInt(this.position_x.value) / width, (width - 1) / width));

        if (position_x + data.width > 1) {
            data.width = 1 - position_x;
        }

        data.position_x = position_x;
        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        });
    }

    change_position_y(data) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        const height = data.size * this.image.naturalHeight;
        const position_y = Math.max(0, Math.min(parseInt(this.position_y.value) / height, (height - 1) / height));

        if (position_y + data.height > 1) {
            data.height = 1 - position_y;
        }

        data.position_y = position_y;
        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        });
    }

    change_width(data) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        const width = data.size * this.image.naturalWidth;
        const new_width = Math.max(1 / width, Math.min(parseInt(this.width.value) / width, 1));

        if (data.position_x + new_width > 1) {
            data.position_x = 1 - new_width;
        }

        data.width = new_width;
        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        });
    }

    change_height(data) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        const height = data.size * this.image.naturalHeight;
        const new_height = Math.max(1 / height, Math.min(parseInt(this.height.value) / height, 1));

        if (data.position_y + new_height > 1) {
            data.position_y = 1 - new_height;
        }

        data.height = new_height;
        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        });
    }

    change_size(data, input) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        const size = Math.max(0.01, Math.min(parseInt(input.value) / 100, 1));
        data.size = size;

        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        });
    }

    change_quality(data, input) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        const quality = Math.max(0.01, Math.min(parseInt(input.value) / 100, 1));
        data.quality = quality;

        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        });
    }

    change_type(data) {
        const this_class = this;
        this.dialog_loading.style.zIndex = 0;

        data.type = this.type.value;
        this.set_options(data, function () {
            this_class.dialog_loading.style.zIndex = -1;
        })
    }

    change_scale(data, input) {
        const scale = Math.max(data.min_scale, Math.min(data.max_scale * parseInt(input.value) / 100, data.max_scale));
        this.scale.value = this.scale_range.value = Math.round(100 * scale / data.max_scale);
        data.scale = scale;
        
        this.edit_block.style.width = scale * this.image.naturalWidth + 'px';
        this.edit_block.style.height = scale * this.image.naturalHeight + 'px';
    }

    edit_image(data) {
        const this_class = this;
        const url = URL.createObjectURL(data.blob);

        this.image.src = url;
        this.canvas_image.hidden = true;
        this.dialog_name.innerText = data.name;
        this.natural_size.value = Math.round(data.blob.size / 1024);
        this.scale.value = this.scale_range.value = Math.round(100 * data.scale / data.max_scale);

        this.dialog_close.onclick = function () {
            this_class.dialog.close();
        }

        this.position_x.onchange = function () {
            this_class.change_position_x(data);
        }

        this.position_y.onchange = function () {
            this_class.change_position_y(data);
        }

        this.width.onchange = function () {
            this_class.change_width(data);
        }

        this.height.onchange = function () {
            this_class.change_height(data);
        }

        this.size.onchange = this.size_range.onchange = function () {
            this_class.change_size(data, this);
        }

        this.quality.onchange = this.quality_range.onchange = function () {
            this_class.change_quality(data, this);
        }

        this.scale.onchange = this.scale_range.onchange = function () {
            this_class.change_scale(data, this);
        }

        this.type.onchange = function () {
            this_class.change_type(data);
        }

        this.dialog_loading.style.zIndex = 0;
        this.dialog.showModal();

        this.image.onload = function () {
            URL.revokeObjectURL(url);

            this_class.edit_block.style.width = data.scale * this_class.image.naturalWidth + 'px';
            this_class.edit_block.style.height = data.scale * this_class.image.naturalHeight + 'px';

            this_class.set_options(data, function () {
                function mouse_up() {
                    document.onmousemove = undefined;
                    document.onmouseup = undefined;

                    this_class.dialog_loading.style.zIndex = 0;
                    this_class.set_options(data, function () {
                        this_class.dialog_loading.style.zIndex = -1;
                    });
                }

                this_class.borders[0].onmousedown = function (event) {
                    const width = this_class.canvas_image.naturalWidth;
                    const height = this_class.canvas_image.naturalHeight;
                    const offset_width = this_class.canvas_image.offsetWidth;
                    const offset_height = this_class.canvas_image.offsetHeight;
                    const top = event.clientY - data.position_y * offset_height;
                    const left = event.clientX - data.position_x * offset_width;
        
                    const max_x = data.position_x + data.width - 1 / width;
                    const max_y = data.position_y + data.height - 1 / height;
        
                    document.onmousemove = function (event) {
                        data.position_x = Math.max(0, Math.min((event.pageX - left) / offset_width, max_x));
                        data.position_y = Math.max(0, Math.min((event.pageY - top) / offset_height, max_y));
                        data.height = max_y - data.position_y;
                        data.width = max_x - data.position_x;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }
        
                this_class.borders[1].onmousedown = function (event) {
                    const height = this_class.canvas_image.naturalHeight;
                    const offset_height = this_class.canvas_image.offsetHeight;
                    const top = event.clientY - data.position_y * offset_height;
        
                    const max_y = data.position_y + data.height - 1 / height;
        
                    document.onmousemove = function (event) {
                        data.position_y = Math.max(0, Math.min((event.pageY - top) / offset_height, max_y));
                        data.height = max_y - data.position_y;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }
        
                this_class.borders[2].onmousedown = function (event) {
                    const width = this_class.canvas_image.naturalWidth;
                    const height = this_class.canvas_image.naturalHeight;
                    const offset_width = this_class.canvas_image.offsetWidth;
                    const offset_height = this_class.canvas_image.offsetHeight;
                    const top = event.clientY - data.position_y * offset_height;
                    const left = event.clientX - (data.position_x + data.width) * offset_width;
        
                    const min_x = data.position_x + 1 / width;
                    const max_y = data.position_y + data.height - 1 / height;
        
                    document.onmousemove = function (event) {
                        const offset_x = Math.max(min_x, Math.min((event.pageX - left) / offset_width, 1));
                        data.position_y = Math.max(0, Math.min((event.pageY - top) / offset_height, max_y));
                        data.width = offset_x - data.position_x;
                        data.height = max_y - data.position_y;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }

                this_class.borders[3].onmousedown = function (event) {
                    const width = this_class.canvas_image.naturalWidth;
                    const offset_width = this_class.canvas_image.offsetWidth;
                    const left = event.clientX - (data.position_x + data.width) * offset_width;
        
                    const min_x = data.position_x + 1 / width;

                    document.onmousemove = function (event) {
                        const offset_x = Math.max(min_x, Math.min((event.pageX - left) / offset_width, 1));
                        data.width = offset_x - data.position_x;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }

                this_class.borders[4].onmousedown = function (event) {
                    const width = this_class.canvas_image.naturalWidth;
                    const height = this_class.canvas_image.naturalHeight;
                    const offset_width = this_class.canvas_image.offsetWidth;
                    const offset_height = this_class.canvas_image.offsetHeight;
                    const top = event.clientY - (data.position_y + data.height) * offset_height;
                    const left = event.clientX - (data.position_x + data.width) * offset_width;
        
                    const min_x = data.position_x + 1 / width;
                    const min_y = data.position_y + 1 / height;

                    document.onmousemove = function (event) {
                        const offset_x = Math.max(min_x, Math.min((event.pageX - left) / offset_width, 1));
                        const offset_y = Math.max(min_y, Math.min((event.pageY - top) / offset_height, 1));
                        data.height = offset_y - data.position_y;
                        data.width = offset_x - data.position_x;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }

                this_class.borders[5].onmousedown = function (event) {
                    const height = this_class.canvas_image.naturalHeight;
                    const offset_height = this_class.canvas_image.offsetHeight;
                    const top = event.clientY - (data.position_y + data.height) * offset_height;

                    const min_y = data.position_y + 1 / height;
        
                    document.onmousemove = function (event) {
                        const offset_y = Math.max(min_y, Math.min((event.pageY - top) / offset_height, 1));
                        data.height = offset_y - data.position_y;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }

                this_class.borders[6].onmousedown = function (event) {
                    const width = this_class.canvas_image.naturalWidth;
                    const height = this_class.canvas_image.naturalHeight;
                    const offset_width = this_class.canvas_image.offsetWidth;
                    const offset_height = this_class.canvas_image.offsetHeight;
                    const top = event.clientY - (data.position_y + data.height) * offset_height;
                    const left = event.clientX - data.position_x * offset_width;
        
                    const max_x = data.position_x + data.width - 1 / width;
                    const min_y = data.position_y + 1 / height;
        
                    document.onmousemove = function (event) {
                        data.position_x = Math.max(0, Math.min((event.pageX - left) / offset_width, max_x));
                        const offset_y = Math.max(min_y, Math.min((event.pageY - top) / offset_height, 1));
                        data.height = offset_y - data.position_y;
                        data.width = max_x - data.position_x;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }

                this_class.borders[7].onmousedown = function (event) {
                    const width = this_class.canvas_image.naturalWidth;
                    const offset_width = this_class.canvas_image.offsetWidth;
                    const left = event.clientX - data.position_x * offset_width;
        
                    const max_x = data.position_x + data.width - 1 / width;

                    document.onmousemove = function (event) {
                        data.position_x = Math.max(0, Math.min((event.pageX - left) / offset_width, max_x));
                        data.width = max_x - data.position_x;
        
                        this_class.set_options(data);
                    }
        
                    document.onmouseup = mouse_up;
                }

                this_class.canvas_image.hidden = false;
                this_class.dialog_loading.style.zIndex = -1;
            });
        }
    }
};